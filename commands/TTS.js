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
        console.log('TTS 1');
        return new Promise((resolve, reject) => {
            try {
                const speechParams = {
                    OutputFormat: 'mp3',
                    SampleRate: '22050',
                    Text: message.cleanContent.replace(process.env.DISCORD_BOT_COMMAND_PREFIX + 'tts ', ''),
                    TextType: 'text',
                    VoiceId: 'Hans'
                };

                /* Initialize Polly and Signer & set contents */
                const signer = new Polly.Presigner(speechParams, new Polly());
                
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
                        console.log('Played TTS URL: ' + url);                            

                        /* Resolve the Promise */
                        resolve();
                    }
                });
            } catch (e) {
                console.log('TTS initialize error');

                reject(e.message);
            }
        });
    }
}

module.exports = TTSCommand;