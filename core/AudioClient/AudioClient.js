const { Op } = require('sequelize');

const Logger = require('../Logger.js');
const db = require('../../models/index.js');
const ExtendedStreamDispatcher = require('./ExtendedStreamDispatcher.js');

let instance = null;

class AudioClient {
    constructor() {
        /* The current channel connection */
        this.connection = null;

        /* The current audio play dispatcher */
        this.dispatcher = null;
        this.finished = false;

        /* The current url */
        this.uri = null;

        this.times = [];

        this.queueID = null;

        /* The stream options cache to keep options consitent between dispatchers */
        this.streamOptions = {
            volume: 1,
        }

        this.repeat = false;
    }

    static getInstance() {
        if (instance === null) {
            instance = new AudioClient();
        }

        return instance;
    }

    async join(channel) {
        /* Disconnect first to clear the old connection */
        this.disconnect();

        /* Join the voice channel and wait for the connection */
        this.connection = await channel.join();

        /* Set the speaking state to false initially (as nothing is playing yet) */
        this.connection.setSpeaking(0);

        Logger.verbose('AudioClient', 1, 'Joined the channel and created an AudioClient');
    }

    disconnect() {
        if (this.connection) {
            this.connection.disconnect();
            Logger.verbose('AudioClient', 1, 'Diconnected the AudioClient.');
        } else {
            Logger.verbose('AudioClient', 1, 'No need to disconnect, we are not connected :)');
        }
    }

    tts(uri) {
        if (this.connection) {
            const resume = this.dispatcher ? !this.finished : false;
            if (resume) {
                Logger.verbose('AudioClient', 1, 'TTS detected previous dispatcher, pausing...');
                this.pause();
            }
            const resumeURI = this.dispatcher ? this.uri : null;
            const resumeTime = this.sumTime();

            Logger.verbose('AudioClient', 1, 'Playing TTS.');
            this.play(uri, true);

            this.dispatcher.on('finish', () => {
                Logger.verbose('AudioClient', 1, 'TTS finished!');
                if (resume) {
                    Logger.verbose('AudioClient', 1, 'Resuming previous dispatcher at time "' + resumeTime + '"...');
                    this.play(resumeURI, false, resumeTime);
                }
            }); 
        }
    }

    async queue(uri, name) {
        Logger.verbose('Commands', 1, '[AudioClient] Adding URI "' + uri + '" with name "' + name + '" to Queue...');

        /* Create the model in the database */
        await db.Queue.create({
            path: uri,
            name: name,
        });
    }

    async skip() {
        Logger.verbose('Commands', 1, '[AudioClient] Skipping current track.');
        if (this.dispatcher) {
            Logger.verbose('AudioClient', 1, 'Stopping current dispatcher...');
            this.dispatcher.stop();
        } else {
            Logger.verbose('AudioClient', 1, 'There is no dispatcher to stop/finish.');
        }
    }

    async next() {
        if (this.repeat) {
            Logger.verbose('AudioClient', 1, 'Repeating current track.');
            return this.play(this.uri);
        }

        /* Remove finished queue item */
        if (this.queueID !== null) {
            await db.Queue.destroy({
                where: {
                    id: this.queueID,
                }
            });      
        }

        /* Get first queue item */
        const entry = await db.Queue.findOne();
        
        /* Set and play the item if there is any */
        if (entry) {
            Logger.verbose('Commands', 1, '[AudioClient] Trying to play queued entry ' + entry.id + ' with path ' + entry.path);
            this.queueID = entry.id;
            this.play(entry.path);
        }
    }


    clearQueue() {
        /* Remove all items from queue */
        db.Queue.destroy({
            where: {},
            truncate: true
        })
    }

    play(uri, tts = false, time = null) {
        if (this.connection) {
            /* Try to play the privded URI and get the dispatcher */
            this.dispatcher = new ExtendedStreamDispatcher(this.connection.play(uri, {
                ...this.streamOptions,
                ...{
                    seek: time ? time / 1000 : 0
                }
            }));
            this.finished = false;

            /* Set the uri */
            this.uri = uri;

            this.times = [
                time ?? 0
            ];

            /* Also update the speaking state */
            this.connection.setSpeaking(1);

            if (!tts) {
                this.dispatcher.on('finish', () => {
                    this.finished = true;

                    this.next();
                }); 
            }
        }
    }

    pause() {
        if (this.dispatcher) {
            Logger.verbose('AudioClient', 1, 'Pausing current dispatcher...');
            this.dispatcher.pause();
            this.times.push(this.dispatcher.getTotalStreamTime());
        } else {
            Logger.verbose('AudioClient', 1, 'There is no dispatcher to pause.');
        }
    }

    async resume() {
        if (this.isPaused()) {
            Logger.verbose('AudioClient', 1, 'Trying to resume dispatcher...');
            this.dispatcher.resume();
        } else {
            Logger.verbose('AudioClient', 1, 'Could not resume dispatcher it is not paused, try playing from Queue...', 'blueBright');
            await this.next();
        }
    }

    volume(volume) {
        this.streamOptions.volume = volume;
        if (this.dispatcher) {
            this.dispatcher.setVolume(volume);
        }
    }

    toggleRepeat() {
        this.repeat = !this.repeat;
        return this.repeat;
    }

    isPaused() {
        return this.dispatcher && this.dispatcher.isPaused();
    }

    sumTime() {
        let sum = 0;
        for (const time of this.times) {
            sum += time;
        }
        return sum;
    }

    getVoiceChannel() {
        if (this.connection) {
            return this.connection.channel.id;
        }

        return null;
    }
}

module.exports = AudioClient;