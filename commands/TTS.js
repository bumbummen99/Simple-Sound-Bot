const { Command } = require('discord-akairo');
const { Polly } = require('aws-sdk');
const AudioClient = require('../core/AudioClient.js'); 

class TTSCommand extends Command {
    constructor() {
        super('tts', {
           aliases: ['tts'] 
        });
    }

    exec(message) {
        return new Promise((resolve, reject) => {
            try {
                /* Initialize Polly and Signer & set contents */
                const signer = new Polly.Presigner({
                    OutputFormat: 'mp3',
                    SampleRate: '22050',
                    Text: message.cleanContent.replace(process.env.DISCORD_BOT_COMMAND_PREFIX + 'tts'),
                    TextType: 'text',
                    VoiceId: 'Hans'
                }, new Polly());

                /* Create presigned URL of synthesized speech file */
                signer.getSynthesizeSpeechUrl(speechParams, function(error, url) {
                    if (error) {
                        /* Reject the Promise with the received error */
                        reject(error);
                    } else {
                        /* Get the AudioClient singleton */
                        const voice = AudioClient.getInstance();

                        /* Play the generated audio file */
                        voice.play(url);

                        /* Resolve the Promise */
                        resolve();
                    }
                });
            } catch (e) {
                reject(e.message);
            }
        });
    }
}

module.exports = TTSCommand;