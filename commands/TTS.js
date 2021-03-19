const fs = require('fs');
const path = require('path');
const md5 = require('md5');

const AbstractCommand = require('../core/abstract/AbstractCommand.js');
const AudioClient = require('../core/AudioClient.js'); 
const PollyTTS = require('../core/PollyTTS.js');
const Downloader = require('../core/Downloader.js');
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

        /* Get the text's hash to prevent downloading the same text multiple times */
        const hash = md5(text);

        const cachePath = path.resolve(process.cwd() + '/cache/tts/' + hash + '.mp3');

        /* Generate and download the TTS audio if it does not already exist */
        if (!fs.existsSync(cachePath)) {
            Logger.verbose('Commands', 1, '[TTS] Input is not cached, generating with AWS Polly...');
            await Downloader.get(await PollyTTS.generate(text), cachePath);
        }

        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Play the generated audio file */
        Logger.verbose('Commands', 1, '[TTS] Playing input from: "' + cachePath + '"');
        voice.tts(cachePath);

        message.reply('Doing as you demand...');
    }
}

module.exports = TTSCommand;