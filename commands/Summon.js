const { Command } = require('discord-akairo');
const AudioClient = require('../core/AudioClient.js'); 

class SummonCommand extends Command {
    constructor() {
        super('summon', {
           aliases: ['summon'] 
        });
    }

    exec(message) {
        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Join the message authors channel */
        return voice.join(message.member.voice.channel);
    }
}

module.exports = SummonCommand;