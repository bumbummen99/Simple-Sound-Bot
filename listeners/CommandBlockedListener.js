const { Listener } = require('discord-akairo');

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }

    exec(message, command, reason) {
        if (message.content.startsWith(process.env.DISCORD_BOT_COMMAND_PREFIX)) {
            /* Blocked as it is not on a guild channel */
            if (reason === 'guild') {
                message.util.reply('You can only use that command on a Discord server!');
            } else {
                message.util.reply('I blocked that! I don\'t know why exactly but i did it anyways :)');
            }
        }
    }
}

module.exports = CommandBlockedListener;
