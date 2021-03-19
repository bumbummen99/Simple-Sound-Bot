const { Command } = require('discord-akairo');
const AudioClient = require('../core/AudioClient.js'); 
const Logger = require('../core/Logger.js');

class LeaveCommand extends Command {
    constructor() {
        super('leave', {
           aliases: ['leave'] 
        });
    }

    async exec(message) {
        Logger.verbose('Commands', 1, '[Leave] Leave command received, leaving...');

        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Join the message authors channel */
        await voice.disconnect();

        Logger.verbose('Commands', 1, '[Leave] Bot left the current channel.');
    }
}

module.exports = LeaveCommand;