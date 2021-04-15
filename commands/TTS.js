const PollyTTS = require('../core/PollyTTS.js');
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');
const PlayerCommand = require('../core/Commands/PlayerCommand.js');

class TTSCommand extends PlayerCommand {
    constructor() {
        super('tts', {
            aliases: ['tts'],
            args: [
                {
                    id: 'text',
                    type: 'string',
                    default: ''
                },
            ]
        });
    }

    async playerExec(message, args) {
        Logger.verbose('Commands', 1, '[TTS] TTS command received. Input: "' + args.text + '"');

        /* Generate or load the cached audio */
        const audioFile = await PollyTTS.generate(args.text);

        const audioClient = this.getAudioClientForGuild(message.guild.id);

        /* Play the generated audio file */
        Logger.verbose('Commands', 1, '[TTS] Playing input from: "' + audioFile + '"');
        audioClient.playBetween(audioFile);

        message.util.reply('Doing as you demand...');
    }
}

module.exports = TTSCommand;