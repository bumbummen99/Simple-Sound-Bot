const fs = require('fs');
const path = require('path');
const md5 = require('md5');

const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js'); 
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

        /* Generate or load the cached audio */
        const audioFile = await PollyTTS.generate(text);

        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Play the generated audio file */
        Logger.verbose('Commands', 1, '[TTS] Playing input from: "' + audioFile + '"');
        voice.tts(audioFile);

        message.reply('Doing as you demand...');
    }
}

module.exports = TTSCommand;