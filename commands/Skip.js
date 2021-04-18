const Logger = require('../core/Services/Logger.js');
const PlayerCommand = require('../core/Commands/PlayerCommand.js');

class SkipCommand extends PlayerCommand {
    constructor() {
        super('skip', {
            aliases: ['skip'],
            channel: 'guild',
        });
    }

    async childExec(message) {
        Logger.getInstance().verbose('Commands', 1, '[Skip] Skip command received, Skip playback...');

        const audioClient = this.getAudioClientForGuild(message.guild.id);

        await audioClient.skip();

        message.util.reply('Doing as you demand...');
    }
}

module.exports = SkipCommand;