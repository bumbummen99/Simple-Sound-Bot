const ytdl = require('ytdl-core');
const fs = require('fs')
const Logger = require('../../../Services/Logger.js');

class YouTubeDL {
    static ytdlPromised(url, path) {
        return new Promise((resolve, reject) => {
            /* Get the Stream */
            const stream = ytdl(url, { quality: 'highestaudio' });

            /* Pipe the Stream into a file */
            stream.pipe(fs.createWriteStream(path));

            /* Resolve the Promise once the stream is finished */
            stream.on('finish', () => {
                resolve()
            });

            /* On errors, reject the promise */
            stream.on('error', e => {
                Logger.getInstance().verbose('YouTubeDL', 4, `[YouTubeDL] YouTubeDL failed, exception: "${e}"`, 'red');

                reject(e)
            });
        });
    }
}

module.exports = YouTubeDL;