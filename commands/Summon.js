import Command from 'discord-akairo';
import AudioClient from '../core/AudioClient.js'; 

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

module.exports = TTSCommand;