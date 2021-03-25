const fs = require('fs');
const path = require('path');
const md5 = require('md5');

const AbstractCommand = require('../core/abstract/AbstractCommand.js');
const AudioClient = require('../core/AudioClient.js'); 
const PollyTTS = require('../core/PollyTTS.js');
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');
const WikiPedia = require('../core/Wikipedia.js');

class TTSWikiCommand extends AbstractCommand {
    constructor() {
        super('ttswiki', {
           aliases: ['ttswiki'] 
        });
    }

    async childExec(message) {
        /* Get the WikiPedia page title or search term from the command message */
        const text = CommandHelper.getCleared(this.id, message);
        Logger.verbose('Commands', 1, '[TTSWiki] TTSWiki command received. Input: "' + text + '"');

        /* Get the WikiPedia page Summary */
        const intro = await WikiPedia.getPageIntro(text);

        /* Generate or load the audio file */
        const audioFile = await PollyTTS.generate(intro);

        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Play the generated audio file */
        Logger.verbose('Commands', 1, '[TTSWiki] Playing input from: "' + audioFile + '"');
        voice.tts(audioFile);

        message.reply('Doing as you demand...');
    }
}

module.exports = TTSWikiCommand;