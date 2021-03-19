const { Command } = require('discord-akairo');
const AudioClient = require('../core/AudioClient.js'); 
const Logger = require('../core/Logger.js');

class SummonCommand extends Command {
    constructor() {
        super('summon', {
           aliases: ['summon'] 
        });
    }

    async exec(message) {
        Logger.verbose('Commands', 1, '[Summon] Summon command received.');

        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Join the message authors channel */
        await voice.join(message.member.voice.channel);

        Logger.verbose('Commands', 1, '[Summon] Summoned the bot.');
    }
}

module.exports = SummonCommand;