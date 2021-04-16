const PlayerCommand = require('../core/Commands/PlayerCommand.js');
const Logger = require('../core/Logger.js');

class LeaveCommand extends PlayerCommand {
    constructor() {
        super('leave', {
            aliases: ['leave'],
            channel: 'guild',
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Leave] Leave command received, leaving...');
        
        const audioClient = this.getAudioClientForGuild(message.guild.id);

        /* Disconnect the AudioClient */
        await audioClient.leave();

        Logger.verbose('Commands', 1, '[Leave] Bot left the current channel.');

        message.util.reply('Screw you guys i\'m going home!');
    }
}

module.exports = LeaveCommand;