const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js'); 
const Logger = require('../core/Logger.js');

class SummonCommand extends AbstractCommand {
    constructor() {
        super('summon', {
           aliases: ['summon'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Summon] Summon command received.');

        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Join the message authors channel */
        await voice.join(message.member.voice.channel);

        Logger.verbose('Commands', 1, '[Summon] Summoned the bot.');
    }
}

module.exports = SummonCommand;