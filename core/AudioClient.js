let instance = null;

class AudioClient {
    constructor() {
        /* The current channel connection */
        this.connection = null;

        /* The current audio play dispatcher */
        this.dispatcher = null;

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
        this.connection = await channel.join();
    }

    disconnect() {
        if (this.connection) {
            this.connection.disconnect();
        }
    }

    play(uri) {
        if (this.connection) {
            this.dispatcher = this.connection.play(uri, this.streamOptions);
        }
    }

    pause() {
        if (this.dispatcher) {
            this.dispatcher.pause();
        }
    }

    resume() {
        if (this.isPaused()) {
            this.dispatcher.resume();
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
}

module.exports = AudioClient;