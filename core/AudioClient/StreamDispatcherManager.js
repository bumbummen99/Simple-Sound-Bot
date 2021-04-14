const uniqid = require('uniqid');

class StreamDispatcherManager {
    constructor() {
        this._dispatchers = new Map();
    }

    add(dispatcherWrapper, uri, time, playBetween) {
        /* Generate a new unique identifier */
        const identifier = uniqid();

        /* Add the dispatcher to the memory */
        this._dispatchers.set(identifier, {
            id: identifier,
            dispatcher: dispatcherWrapper,
            uri: uri,
            time: time,
            playBetween: playBetween,
        });

        /* Return the unique identifier */
        return identifier;
    }

    get(identifier) {
        return this._dispatchers.get(identifier);
    }

    remove(identifier) {
        this._dispatchers.delete(identifier);
    }
}

module.exports = StreamDispatcherManager;
