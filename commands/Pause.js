const { Command } = require('discord-akairo');

const AudioClient = require('../core/AudioClient.js');

class TTSCommand extends Command {
    constructor() {
        super('pause', {
           aliases: ['pause'] 
        });
    }

    async exec(message) {
        AudioClient.getInstance().pause();

        message.reply('Doing as you demand...');
    }
}

module.exports = TTSCommand;