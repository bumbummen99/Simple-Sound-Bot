const EventEmitter = require("events");

class ExtendedStreamDispatcher extends EventEmitter {
    constructor(dispatcher) {
        super();

        this.dispatcher = dispatcher;

        this.attachListeners();
    }

    /**
     * Attach to dispatcher event listeners to foreward
     * basic events.
     */
      attachListeners() {
        this.dispatcher.on('start', () => {
            this.emit('start');
        });

        this.dispatcher.on('finish', () => {
            this.emit('finish');
        });

        this.dispatcher.on('speaking', state => {
            this.emit('speaking', state)
        });

        this.dispatcher.on('volumeChange', (oldVolume, newVolume) => {
            this.emit('volumeChange', oldVolume, newVolume)
        });

        this.dispatcher.on('error', () => {
            this.emit('error');
        });

        this.dispatcher.on('debug', info => {
            this.emit('debug', info);
        });
    }

    pause() {
        this.dispatcher.pause();

        this.emit('paused');
    }

    resume() {
        this.dispatcher.resume();

        this.emit('resumed');
    }

    setVolume(volume) {
        this.dispatcher.setVolume(volume);
    }

    isPaused() {
        return this.dispatcher.paused;
    }

    /**
     * Pauses the current playback and
     * emits the finished event.
     */
    stop() {
        this.dispatcher.pause();

        this.emit('finish');
    }

    getTotalStreamTime() {
        return this.dispatcher.totalStreamTime;
    }
}

module.exports = ExtendedStreamDispatcher;
