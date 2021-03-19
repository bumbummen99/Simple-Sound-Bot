const { Command } = require('discord-akairo');

const AudioClient = require('../core/AudioClient.js');
const Logger = require('../core/Logger.js');

class PauseCommand extends Command {
    constructor() {
        super('pause', {
           aliases: ['pause'] 
        });
    }

    async exec(message) {
        Logger.verbose('Commands', 1, '[Pause] Pause command received, pausing playback...');

        AudioClient.getInstance().pause();

        message.reply('Doing as you demand...');
    }
}

module.exports = PauseCommand;