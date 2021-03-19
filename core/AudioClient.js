let instance;

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
        if (!instance) {
            instance = new AudioClient();
        }

        return instance;
    }

    async join(channel) {
        this.connection = await channel.join();
    }

    async play(uri) {
        this.dispatcher = this.connection.play(uri, this.streamOptions);
    }

    pause() {
        if (this.dispatcher) {
            this.dispatcher.pause();
        }
    }

    volume(volume) {
        this.streamOptions.volume = volume;
        if (this.dispatcher) {
            this.dispatcher.setVolume(volume);
        }
    }
}

module.exports = AudioClient;