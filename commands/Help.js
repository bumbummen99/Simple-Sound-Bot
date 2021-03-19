const AbstractCommand = require('../core/abstract/AbstractCommand.js');
const Logger = require('../core/Logger.js');

class HelpCommand extends AbstractCommand {
    constructor() {
        super('help', {
           aliases: ['help'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Commands] Commands command received, giving some info...');

        return message.reply(`Simple Sound-Bot v${process.env.SOUND_BOT_VERSION} Help:
${process.env.DISCORD_BOT_COMMAND_PREFIX}summon - Summons the bot to your current audio channel if you are in one.
${process.env.DISCORD_BOT_COMMAND_PREFIX}leave - Makes the bot leave the audio channel it is currently connected to.
${process.env.DISCORD_BOT_COMMAND_PREFIX}tts - Text to speech, no explanation needed
${process.env.DISCORD_BOT_COMMAND_PREFIX}play - Plays a youtube video URL
${process.env.DISCORD_BOT_COMMAND_PREFIX}volume - sets the volume, use values like "0.5", "1", "50" or "100".
`);
    }

    isAllowed() {
        return true;
    }
}

module.exports = HelpCommand;