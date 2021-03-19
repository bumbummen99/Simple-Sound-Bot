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
        /* Join the voice channel and wait for the connection */
        this.connection = await channel.join();

        /* Set the speaking state to false initially (as nothing is playing yet) */
        this.connection.setSpeaking(0);
    }

    disconnect() {
        if (this.connection) {
            this.connection.disconnect();
        }
    }

    play(uri) {
        if (this.connection) {
            /* Try to play the privded URI and get the dispatcher */
            this.dispatcher = this.connection.play(uri, this.streamOptions);

            /* Also update the speaking state */
            this.connection.setSpeaking(1);
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