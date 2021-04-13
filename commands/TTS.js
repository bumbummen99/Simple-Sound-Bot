const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js'); 
const PollyTTS = require('../core/PollyTTS.js');
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');

class TTSCommand extends AbstractCommand {
    constructor() {
        super('tts', {
           aliases: ['tts'] 
        });
    }

    async childExec(message) {
        /* Get the TTS text from the message */
        const text = CommandHelper.getCleared(this.id, message);

        Logger.verbose('Commands', 1, '[TTS] TTS command received. Input: "' + text + '"');

        /* Generate or load the cached audio */
        const audioFile = await PollyTTS.generate(text);

        /* Play the generated audio file */
        Logger.verbose('Commands', 1, '[TTS] Playing input from: "' + audioFile + '"');
        AudioClient.playBetween(audioFile);

        message.util.reply('Doing as you demand...');
    }
}

module.exports = TTSCommand;