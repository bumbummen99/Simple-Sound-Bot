const Logger = require('../Logger.js');
const StreamDispatcherWrapper = require('./StreamDispatcherWrapper.js');
const db = require('../../models/index.js');

class AudioClient {
    constructor() {
        this._uri = null;

        this._queueID = null;

        this._repeat = false;

        /* The current channel connection */
        this.connection = null;

        /* The wrapper for the current connections dispatcher */
        this.dispatcher = null;

        /* The stream options cache to keep options consitent between dispatchers */
        this.streamOptions = {
            volume: 1,
        }

        this._times = [];
    }

    async join(channel) {
        let resume = null;
        if (this.hasDispatcher() && !this.getDispatcher().isFinished() && !this.getDispatcher().isPaused()) {
            Logger.verbose('AudioClient', 1, '[AudioClient] Join detected previous dispatcher, pausing...');

            this.pause();

            resume = {
                resumeURI: this._uri,
                resumeTime: this._sumTime(),
            };
        }

        /* Join the voice channel and wait for the connection */
        this.connection = await channel.join();

        /* Set the speaking state to false initially (as nothing is playing yet) */
        this.connection.setSpeaking(0);

        Logger.verbose('AudioClient', 1, 'Successfully connected to channel "' + channel.name + '"');

        if (resume) {
            Logger.verbose('AudioClient', 1, '[AudioClient] Resuming previous playback at time "' + resume.resumeTime + '"...');
            this.play(resume.resumeURI, true, resume.resumeTime);
        }
    }

    leave() {
        /* Check if there is a connection */
        if (this.isConnected()) {
            /* Cache the channel name */
            const name = this.connection.channel.name;

            /* Also clear the dispatcher */
            if (this.dispatcher) {
                this.dispatcher.pause();
                this.dispatcher = null;
            }

            /* Disconnect from the channel */
            this.connection.disconnect();
            this.connection = null;            

            Logger.verbose('AudioClient', 1, 'Diconnected the AudioClient from channel "' + name + '".');
        } else {
            Logger.verbose('AudioClient', 1, 'No need to disconnect, we are not connected :)');
        }
    }

    async queue(path, name) {
        /* Create the model in the database */
        await db.Queue.create({
            path: path,
            name: name,
        });

        Logger.verbose('Player', 1, '[Player] Added URI "' + path + '" with name "' + name + '" to the Queue.');
    }

    clearQueue() {
        /* Remove all items from queue */
        db.Queue.destroy({
            where: {},
            truncate: true
        });

        Logger.verbose('Player', 1, '[Player] Cleared the whole Queue.');
    }

    async next() {
        if (this._repeat) {
            Logger.verbose('Player', 1, '[Player] Repeating current track.');
            return this.play(this._uri);
        }

        /* Remove finished queue item */
        if (this._queueID !== null) {
            await db.Queue.destroy({
                where: {
                    id: this._queueID,
                }
            });      
        }

        /* Get first queue item */
        const entry = await db.Queue.findOne();
        
        /* Set and play the item if there is any */
        if (entry) {
            Logger.verbose('CommPlayerands', 1, '[Player] Trying to play queued entry ' + entry.id + ' with path ' + entry.path);
            this._queueID = entry.id;
            this.play(entry.path);
        }
    }

    playBetween(uri) {
        if (this.isConnected()) {
            let resume = null;
            if (this.hasDispatcher() && !this.getDispatcher().isFinished() && !this.getDispatcher().isPaused()) {
                Logger.verbose('AudioClient', 1, '[Player] PlayBetween detected previous dispatcher, pausing...');

                this.pause();

                resume = {
                    resumeURI: this._uri,
                    resumeTime: this._sumTime(),
                };
            }

            Logger.verbose('Player', 1, '[Player] Playing between...');
            this.play(uri, false);

            this.getDispatcher().on('finish', () => {
                Logger.verbose('Player', 1, '[Player] PlayBetween finished!');
                if (resume) {
                    Logger.verbose('Player', 1, '[Player] Resuming previous dispatcher at time "' + resume.resumeTime + '"...');
                    this.play(resume.resumeURI, true, resume.resumeTime);
                }
            }); 
        }
    }

    play(uri, next = true, time = 0) {
        if (this.isConnected()) {
            Logger.verbose('Player', 1, '[Player] Trying to play "' + uri + '"...');

            /* Try to play the privded URI and get the dispatcher */
            this.dispatcher = new StreamDispatcherWrapper(this.connection.play(uri, {
                ...this.streamOptions,
                ...{
                    seek: time / 1000
                }
            }));

            this._uri = uri;

            this._times = [
                time
            ];

            /* Also update the speaking state */
            this.connection.setSpeaking(1);

            if (next) {
                this.dispatcher.on('finish', () => {
                    this.next();
                }); 
            }

            return this.dispatcher;
        }

        return null;
    }

    pause() {
        if (this.hasDispatcher()) {
            /* Pause the dispatcher playback */
            this.dispatcher.pause();

            /* Set speaking state */
            this.connection.setSpeaking(0);

            Logger.verbose('AudioClient', 1, 'Paused the current dispatcher.');

            this._times.push(this.dispatcher.getTotalStreamTime());
        } else {
            Logger.verbose('AudioClient', 1, 'There is no dispatcher to pause.');

            return 0;
        }
    }

    resume() {
        /* Check if the dispatcher is paused first */
        if (this.hasDispatcher()) {
            /* Try to resume the current dispatcher */
            this.dispatcher.resume();

            /* Set speaking state */
            this.connection.setSpeaking(1);

            Logger.verbose('AudioClient', 1, 'Successfully resumed the dispatcher.');
        } else {
            Logger.verbose('AudioClient', 1, 'There is nothing to resume.');
        }
    }

    skip() {
        Logger.verbose('Commands', 1, '[AudioClient] Skipping current track.');
        if (this.hasDispatcher()) {
            Logger.verbose('AudioClient', 1, 'Stopping current dispatcher...');
            this.dispatcher.skip();
        } else {
            Logger.verbose('AudioClient', 1, 'There is no dispatcher to stop/finish.');
        }
    }

    stop() {
        /* Check for an dispatcher first */
        if (this.hasDispatcher()) {
            /* Stop the current playback */
            this.dispatcher.stop();

            /* Set speaking state */
            this.connection.setSpeaking(0);

            Logger.verbose('AudioClient', 1, 'Stopping current dispatcher...');
        } else {
            Logger.verbose('AudioClient', 1, 'There is no dispatcher to stop/finish.');
        }
    }

    volume(volume) {
        /* Cache the setting */
        this.streamOptions.volume = volume;

        /* Apply the setting if there is a dispatcher */
        if (this.hasDispatcher()) {
            this.dispatcher.setVolume(volume);
            Logger.verbose('AudioClient', 1, 'Successfully set the volume to: ' + volume + '.');
        } else {
            Logger.verbose('AudioClient', 1, 'There is no dispatcher to set the volume on.');
        }
    }

    isConnected() {
        return this.connection &&  this.connection.status === 0;
    }

    hasDispatcher() {
        return this.isConnected() && this.dispatcher;
    }

    getDispatcher() {
        return this.dispatcher;
    }

    getVoiceChannel() {
        if (this.isConnected()) {
            return this.connection.channel;
        }

        return null;
    }

    isPaused() {
        return this.hasDispatcher() && this.dispatcher.isPaused();
    }

    toggleRepeat() {
        this._repeat = !this._repeat;
    }

    _sumTime() {
        let sum = 0;
        for (const time of this._times) {
            sum += time;
        }
        return sum;
    }
}

module.exports = new AudioClient();