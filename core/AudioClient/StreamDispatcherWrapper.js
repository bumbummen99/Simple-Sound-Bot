const { StreamDispatcher } = require("discord.js");
const EventEmitter = require("events");

class StreamDispatcherWrapper extends EventEmitter {
    constructor(dispatcher) {
        super();

        this._finished = false;

        this.setDispatcher(dispatcher);
    }


    setDispatcher(dispatcher) {
        this._dispatcher = dispatcher;

        this.attachListeners();
    }

    /**
     * Attach to dispatcher event listeners to foreward
     * basic events.
     */
    attachListeners() {
        this._dispatcher.on('start', () => {
            this.emit('start');
        });

        this._dispatcher.on('finish', () => {
            this._finished = true;

            this.emit('finish');
        });

        this._dispatcher.on('speaking', state => {
            this.emit('speaking', state)
        });

        this._dispatcher.on('volumeChange', (oldVolume, newVolume) => {
            this.emit('volumeChange', oldVolume, newVolume)
        });

        this._dispatcher.on('error', () => {
            this.emit('error');
        });

        this._dispatcher.on('debug', info => {
            this.emit('debug', info);
        });
    }

    pause() {
        if (!this._finished) {
            this._dispatcher.pause();

            this.emit('paused');

            return true;
        } else {
            return false;
        }
    }

    resume() {
        if (!this._finished) {
            this._dispatcher.resume();

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
        if (!this._finished) {
            this._dispatcher.pause();

            this._finished = true;
    
            this.emit('finish');

            return true;
        } else {
            return false;
        }
    }

    setVolume(volume) {
        this._dispatcher.setVolume(volume);
    }

    getTotalStreamTime() {
        return this._dispatcher.totalStreamTime;
    }

    isFinished() {
        return this._finished;
    }

    isPaused() {
        return this._dispatcher.paused;
    }
}

module.exports = StreamDispatcherWrapper;
