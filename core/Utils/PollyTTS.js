const { Polly } = require('aws-sdk');
const md5 = require('md5');
const fs = require('fs');
const path = require('path');
const Downloader = require('./Downloader');
const Logger = require('../Services/Logger');

class PollyTTS {
    static async generate(text) {
        const path = PollyTTS.getCachePath(text);

        /* Generate and download the TTS audio if it does not already exist */
        if (!fs.existsSync(path)) {
            Logger.getInstance().verbose('PollyTTS', 1, 'Input is not cached, generating with AWS Polly...', 'blueBright');
            await Downloader.get(await PollyTTS._generator(text), path);
        }

        return path;
    }

    static _generator(text) {
        return new Promise((resolve, reject) => {
            try {
                const speechParams = {
                    OutputFormat: 'mp3',
                    SampleRate: '22050',
                    Text: text,
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
                        /* Resolve the Promise */
                        resolve(url);
                    }
                });
            } catch (e) {
                reject(e.message);
            }
        });
    }

    static getCachePath(data) {
        return path.resolve(process.cwd() + '/cache/tts/' + md5(data) + '.mp3');
    }
}

module.exports = PollyTTS;