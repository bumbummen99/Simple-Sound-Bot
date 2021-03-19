const { Polly } = require('aws-sdk');

class PollyTTS {
    static generate(text) {
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
}

module.exports = PollyTTS;