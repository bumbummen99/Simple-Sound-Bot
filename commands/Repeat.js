const PlayerCommand = require('../core/Commands/PlayerCommand.js');

class RepeatCommand extends PlayerCommand {
    constructor() {
        super('repeat', {
           aliases: ['repeat'] 
        });
    }

    async playerExec(message) {
        const audioClient = this.getAudioClientForGuild(message.guild.id);
        
        const state = audioClient.toggleRepeat();

        message.util.reply((state ? 'Enabled' : 'Disabled') + ' track repeat.');
    }
}

module.exports = RepeatCommand;