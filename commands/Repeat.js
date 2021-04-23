const PlayerCommand = require('../core/Commands/PlayerCommand.js');

class RepeatCommand extends PlayerCommand {
    constructor() {
        super('repeat', {
            aliases: ['repeat', 'loop'],
            channel: 'guild',
        });
    }

    async childExec(message) {
        const audioClient = this.getAudioClientForGuild(message.guild.id);

        const state = audioClient.toggleRepeat();

        message.util.reply((state ? 'Enabled' : 'Disabled') + ' track repeat.');
    }
}

module.exports = RepeatCommand;