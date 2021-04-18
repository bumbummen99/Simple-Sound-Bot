const PlayerCommand = require('../core/Commands/PlayerCommand.js');
const Logger = require('../core/Services/Logger.js');

class PauseCommand extends PlayerCommand {
    constructor() {
        super('pause', {
            aliases: ['pause'],
            channel: 'guild',
        });
    }

    async childExec(message) {
        Logger.getInstance().verbose('Commands', 1, '[Pause] Pause command received, pausing playback...');

        const audioClient = this.getAudioClientForGuild(message.guild.id);

        /* Pause the playback */
        audioClient.pause();

        message.util.reply('Doing as you demand...');
    }
}

module.exports = PauseCommand;