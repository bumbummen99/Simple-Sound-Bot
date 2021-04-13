const { Listener } = require('discord-akairo');
const Logger = require('../core/Logger');

class VoiceStateUpdateListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec(oldState, newState) {
        Logger.verbose('Bot', 1, 'Bot is ready!');
    }
}

module.exports = VoiceStateUpdateListener;
