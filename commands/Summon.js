const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js'); 
const PollyTTS = require('../core/PollyTTS.js');
const Logger = require('../core/Logger.js');

class SummonCommand extends AbstractCommand {
    constructor() {
        super('summon', {
           aliases: ['summon'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Summon] Summon command received.');

        /* Check if the author is in a voice channel */
        if (!message.member.voice.channel) {
            message.util.reply('You are not in a voice channel!');
        }

        /* Join the message authors channel */
        await AudioClient.join(message.member.voice.channel);

        /* Greet the channel with a slight delay */
        setTimeout(async () => {
            AudioClient.playBetween(await PollyTTS.generate(process.env.GREET_TEMPLATE));
        }, 500);
        
        Logger.verbose('Commands', 1, '[Summon] Summoned the bot.');
    }
}

module.exports = SummonCommand;