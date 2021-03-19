const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const { Command } = require('discord-akairo');

const AudioClient = require('../core/AudioClient.js'); 
const PollyTTS = require('../core/PollyTTS.js');
const Downloader = require('../core/Downloader.js');

class TTSCommand extends Command {
    constructor() {
        super('tts', {
           aliases: ['tts'] 
        });
    }

    async exec(message) {
        /* Get the TTS text from the message */
        const text = message.cleanContent.replace(process.env.DISCORD_BOT_COMMAND_PREFIX + 'tts ', '');

        /* Get the text's hash to prevent downloading the same text multiple times */
        const hash = md5(text);

        const cachePath = path.resolve(process.cwd() + '/cache/tts/' + hash + '.mp3');

        /* Generate and download the TTS audio if it does not already exist */
        if (!fs.existsSync(cachePath)) {
            await Downloader.get(await PollyTTS.generate(text), cachePath);
        }

        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Play the generated audio file */
        console.log('TTS trying to play: ' + cachePath);
        voice.play(cachePath);

        message.reply('Doing as you demand...');
    }
}

module.exports = TTSCommand;