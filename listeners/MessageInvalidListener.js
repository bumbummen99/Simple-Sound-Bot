const { Listener } = require('discord-akairo');
const Logger = require('../core/Logger');

class VoiceStateUpdateListener extends Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

    exec(message) {
        if (message.content.startsWith(process.env.DISCORD_BOT_COMMAND_PREFIX)) {
            Logger.verbose('Commands', 1, 'Invalid command detected: "' + message.content + '"');
            message.util.reply('Sorry, that command is invalid');
        }
    }
}

module.exports = VoiceStateUpdateListener;
