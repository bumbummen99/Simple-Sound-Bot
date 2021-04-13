const EventEmitter = require("events");

class StreamDispatcherWrapper extends EventEmitter {
    constructor(dispatcher) {
        super();

        this.dispatcher = dispatcher;
        this.finished = false;

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
            this.finished = true;

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
        if (!this.finished) {
            this.dispatcher.pause();

            this.emit('paused');

            return true;
        } else {
            return false;
        }
    }

    resume() {
        if (!this.finished) {
            this.dispatcher.resume();

            this.emit('resumed');

            return true;
        } else {
            return false;
        }
    }

    /**
     * Pauses the current playback and
     * emits the finished event.
     */
    skip() {
        if (!this.finished) {
            this.dispatcher.pause();

            this.finished = true;
    
            this.emit('finish');

            return true;
        } else {
            return false;
        }
    }

    setVolume(volume) {
        this.dispatcher.setVolume(volume);
    }

    getTotalStreamTime() {
        return this.dispatcher.totalStreamTime;
    }

    isFinished() {
        return this.finished;
    }

    isPaused() {
        return this.dispatcher.paused;
    }
}

module.exports = StreamDispatcherWrapper;
