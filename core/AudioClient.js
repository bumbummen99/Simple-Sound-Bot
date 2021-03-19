const Logger = require('./Logger.js');

let instance = null;

class AudioClient {
    constructor() {
        /* The current channel connection */
        this.connection = null;

        /* The current audio play dispatcher */
        this.dispatcher = null;

        /* The current url */
        this.uri = null;

        this.times = [];

        /* The stream options cache to keep options consitent between dispatchers */
        this.streamOptions = {
            volume: 1,
        }
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
            const resume = this.dispatcher ? !this.isPaused() : false;
            if (resume) {
                Logger.verbose('AudioClient', 1, 'TTS detected previous dispatcher, pausing...');
                this.pause();
            }
            const resumeURI = this.dispatcher ? this.uri : null;
            const resumeTime = this.sumTime();

            Logger.verbose('AudioClient', 1, 'Playing TTS.');
            this.play(uri);

            this.dispatcher.on('finish', () => {
                if (resume) {
                    Logger.verbose('AudioClient', 1, 'TTS finished! Resuming previous dispatcher at time "' + resumeTime + '"...');
                    this.play(resumeURI, resumeTime);
                }
            }); 
        }
    }

    play(uri, time = null) {
        if (this.connection) {
            /* Try to play the privded URI and get the dispatcher */
            this.dispatcher = this.connection.play(uri, {...this.streamOptions, ...{seek: time ? time / 1000 : 0}});

            /* Set the uri */
            this.uri = uri;

            this.times = [
                time ?? 0
            ];

            /* Also update the speaking state */
            this.connection.setSpeaking(1);
        }
    }

    pause() {
        if (this.dispatcher) {
            Logger.verbose('AudioClient', 1, 'Pausing current dispatcher...');
            this.dispatcher.pause();
            this.times.push(this.dispatcher.totalStreamTime);
        } else {
            Logger.verbose('AudioClient', 1, 'There is no dispatcher to pause.');
        }
    }

    resume() {
        if (this.isPaused()) {
            Logger.verbose('AudioClient', 1, 'Trying to resume dispatcher...');
            this.dispatcher.resume();
        } else {
            Logger.verbose('AudioClient', 1, 'Could not resume dispatcher it is not paused.');
        }
    }

    volume(volume) {
        this.streamOptions.volume = volume;
        if (this.dispatcher) {
            this.dispatcher.setVolume(volume);
        }
    }

    isPaused() {
        return this.dispatcher && this.dispatcher.paused;
    }

    sumTime() {
        let sum = 0;
        for (const time of this.times) {
            sum += time;
        }
        return sum;
    }
}

module.exports = AudioClient;