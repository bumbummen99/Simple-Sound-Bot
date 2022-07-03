const Logger = require('../Services/Logger.js');
const StreamDispatcherWrapper = require('./StreamDispatcherWrapper.js');
const StreamDispatcherManager = require('./StreamDispatcherManager.js');
const Queue = require('../Player/Queue.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

class AudioClient {
    constructor(guildId) {
        this._guildId = guildId;

        this._queueID = null;

        this._repeat = false;

        /* The current channel connection */
        this.connection = null;

        /* The wrapper for the current connections dispatcher */
        this._currentDispatcherIdentifier = null;
        this._dispatcherManager = new StreamDispatcherManager();

        /* The stream options cache to keep options consitent between dispatchers */
        this.streamOptions = {
            volume: 1,
        }
    }

    async join(channel) {
        /* Join the voice channel and wait for the connection to be ready*/
        await new Promise ((resolve, reject) => {
            /* Connect to the channel */
            this.connection = joinVoiceChannel({
                channelId: channel,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            })

            /* Throw on error */
            .once('error', reject)

            /* Resolve when ready */
            .once(VoiceConnectionStatus.Ready, resolve);

            /* Do not wait forever */
            setTimeout(() => {
                Logger.getInstance().verbose('AudioClient', 1, 'Timeout connecting to channel "' + channel.name + '"');
                reject()
            }, 1000 * 3);
        })

        /* Set the speaking state to false initially (as nothing is playing yet) */
        this.connection.setSpeaking(0);

        Logger.getInstance().verbose('AudioClient', 1, 'Successfully connected to channel "' + channel.name + '"');
    }

    leave() {
        /* Check if there is a connection */
        if (this.isConnected()) {
            /* Cache the channel name */
            const name = this.connection.channel.name;

            /* Also clear the dispatcher */
            if (this.getDispatcher()) {
                this.getDispatcher().pause();
            }

            /* Disconnect from the channel */
            this.connection.disconnect();
            this.connection = null;            

            Logger.getInstance().verbose('AudioClient', 1, `Diconnected the AudioClient from channel "${name}".`);
        } else {
            Logger.getInstance().verbose('AudioClient', 1, 'No need to disconnect, we are not connected :)');
        }
    }

    async next(uri) {
        if (this._repeat) {
            Logger.getInstance().verbose('AudioClient', 1, 'Repeating current track.');

            return this.play(uri);
        }

        /* Remove finished queue item */
        if (this._queueID !== null) {
            await Queue.removeEntry(this._queueID);    
        }

        /* Get first queue item */
        const entry = await Queue.nextInQueue(this._guildId);
        
        /* Set and play the item if there is any */
        if (entry) {
            Logger.getInstance().verbose('AudioClient', 4, `Found entry: ${JSON.stringify(entry)}, Type: ${typeof entry}`);
            Logger.getInstance().verbose('AudioClient', 1, `Trying to play queued entry ${entry.id} with path ${entry.path} for guild ${this._guildId}`);
            this._queueID = entry.id;
            this.play(entry.path);
        }
    }

    playBetween(uri) {
        if (this.isConnected()) {
            let resume = null;
            if (this.hasDispatcher() && !this.getDispatcher().isFinished() && !this.getDispatcher().isPaused()) {
                Logger.getInstance().verbose('AudioClient', 1, 'PlayBetween detected previous dispatcher, pausing...');

                this.pause();

                resume = this.getDispatcherData();
            }

            Logger.getInstance().verbose('AudioClient', 1, 'Playing between...');
            this.play(uri, false);

            this.getDispatcher().on('finish', () => {
                Logger.getInstance().verbose('AudioClient', 1, 'PlayBetween finished!');

                if (resume) {
                    Logger.getInstance().verbose('AudioClient', 1, `Resuming previous dispatcher at time "${resume.time}"...`);
                    this.play(resume.uri, resume.playBetween, resume.time, resume.dispatcher, resume.id);
                }
            }); 
        }
    }

    play(uri, next = true, time = 0, wrapper = null, identifier = null) {
        if (this.isConnected()) {
            Logger.getInstance().verbose('AudioClient', 1, `Trying to play "${uri}"...`);

            /* Try to play the privded URI and get the dispatcher */
            const dispatcher = this.connection.play(uri, {
                ...this.streamOptions,
                ...{
                    seek: time / 1000
                }
            });

            /* Also update the speaking state */
            this.connection.setSpeaking(1);

            if (wrapper) {
                wrapper.setDispatcher(dispatcher);
            } else {
                wrapper = new StreamDispatcherWrapper(dispatcher);
                
                wrapper.on('finish', () => {
                    this._dispatcherManager.remove(identifier);

                    if (next) {
                        this.next(uri);
                    }
                });

                /* Add the new wrapper to the manager */
                identifier = this._dispatcherManager.add(wrapper, uri, time)
            }
 
            this._currentDispatcherIdentifier = identifier;

            return identifier;
        }

        return null;
    }

    pause() {
        if (this.hasDispatcher()) {
            /* Pause the dispatcher playback */
            this.getDispatcher().pause();

            /* Set speaking state */
            this.connection.setSpeaking(0);

            this.getDispatcherData().time += this.getDispatcher().getTotalStreamTime();

            Logger.getInstance().verbose('AudioClient', 1, `Paused the current dispatcher at ${this.getDispatcherData().time}ms.`);
        } else {
            Logger.getInstance().verbose('AudioClient', 1, 'There is no dispatcher to pause.');
        }
    }

    resume() {
        /* Check if the dispatcher is paused first */
        if (this.hasDispatcher()) {
            /* Try to resume the current dispatcher */
            this.getDispatcher().resume();

            /* Set speaking state */
            this.connection.setSpeaking(1);

            Logger.getInstance().verbose('AudioClient', 1, 'Successfully resumed the dispatcher.');
        } else {
            Logger.getInstance().verbose('AudioClient', 1, 'There is nothing to resume.');
        }
    }

    skip() {
        Logger.getInstance().verbose('Commands', 1, '[AudioClient] Skipping current track.');
        if (this.hasDispatcher()) {
            Logger.getInstance().verbose('AudioClient', 1, 'Stopping current dispatcher...');
            this.getDispatcher().skip();
        } else {
            Logger.getInstance().verbose('AudioClient', 1, 'There is no dispatcher to stop/finish.');
        }
    }

    stop() {
        /* Check for an dispatcher first */
        if (this.hasDispatcher()) {
            /* Stop the current playback */
            this.getDispatcher().stop();

            /* Set speaking state */
            this.connection.setSpeaking(0);

            Logger.getInstance().verbose('AudioClient', 1, 'Stopping current dispatcher...');
        } else {
            Logger.getInstance().verbose('AudioClient', 1, 'There is no dispatcher to stop/finish.');
        }
    }

    volume(volume) {
        /* Cache the setting */
        this.streamOptions.volume = volume;

        /* Apply the setting if there is a dispatcher */
        if (this.hasDispatcher()) {
            this.getDispatcher().setVolume(volume);
            Logger.getInstance().verbose('AudioClient', 1, `Successfully set the volume to: '${volume}'.`);
        } else {
            Logger.getInstance().verbose('AudioClient', 1, 'There is no dispatcher to set the volume on.');
        }
    }

    isConnected() {
        return this.connection &&  this.connection.status === 0;
    }

    hasDispatcher() {
        return this.isConnected() && this.getDispatcher();
    }

    getDispatcherData() {
        if (this._currentDispatcherIdentifier) {
            return this._dispatcherManager.get(this._currentDispatcherIdentifier) ?? null;
        }
        
        return null;
    }

    /**
     * 
     * @returns {StreamDispatcherWrapper}
     */
    getDispatcher() {
        if (this._currentDispatcherIdentifier) {
            const data = this._dispatcherManager.get(this._currentDispatcherIdentifier);
            if (data) {
                return data.dispatcher
            }
        }
        
        return null;
    }

    getVoiceChannel() {
        if (this.isConnected()) {
            return this.connection.channel;
        }

        return null;
    }

    isPaused() {
        return this.hasDispatcher() && this.getDispatcher().isPaused();
    }

    toggleRepeat() {
        this._repeat = !this._repeat;
        return this._repeat;
    }

    _sumTime() {
        let sum = 0;
        for (const time of this._times) {
            sum += time;
        }
        return sum;
    }
}

module.exports = AudioClient;