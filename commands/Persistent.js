const GuildsManger = require('../core/AudioClient/GuildsManger.js');
const PlayerCommand = require('../core/Commands/PlayerCommand.js');

class PersistentCommand extends PlayerCommand {
    constructor() {
        super('persistent', {
            aliases: ['persistent', 'persist', '24/7'],
            channel: 'guild',
        });
    }

    async childExec(message) {
        const state = GuildsManger.togglePersistance(message.guild.id);

        message.util.reply(`${state ? 'Enabled' : 'Disabled'} persistence.`);
    }
}

module.exports = PersistentCommand;