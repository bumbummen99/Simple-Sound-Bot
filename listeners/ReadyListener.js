const { Listener } = require('discord-akairo');
const Logger = require('../core/Services/Logger');

class VoiceStateUpdateListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec(oldState, newState) {
        Logger.getInstance().verbose('Bot', 1, 'Bot is ready!');
    }
}

module.exports = VoiceStateUpdateListener;
