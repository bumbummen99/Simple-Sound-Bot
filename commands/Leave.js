const { Command } = require('discord-akairo');
const AudioClient = require('../core/AudioClient.js'); 

class LeaveCommand extends Command {
    constructor() {
        super('leave', {
           aliases: ['leave'] 
        });
    }

    exec(message) {
        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Join the message authors channel */
        return voice.disconnect();
    }
}

module.exports = LeaveCommand;