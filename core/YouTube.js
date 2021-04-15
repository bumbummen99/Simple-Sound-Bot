const md5 = require('md5');
const ytdl = require('ytdl-core');
const fs = require('fs')
const path = require('path');
const urlStatusCode = require('url-status-code')

const db = require('../models/index.js');
const Logger = require('./Logger.js');

class YouTube {
    static getIdFromURL(url) {
        if (url != undefined || url != '') {
            /* Try to get the ID from the YouTube URL */
            const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/);
            
            if (match && match[2].length == 11) {
                return match[2];
            }
        }

        return null;
    }

    static async download(url, cachePath) {
        const id = YouTube.getIdFromURL(url);

        /* Try to find the video information */
        let video = await db.Video.findOne({
            where: {
                videoID: id,
            }
        });

        if (!video) {
            Logger.verbose('Commands', 1, '[YouTube] Video "' + id + '" not in database, retrieving information...', 'blueBright');

            /* Fetch the video info with youtube dl */
            const info = await ytdl.getInfo(url);

            /* Get corrent thumbnail url */
            let thumbnail = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
            if (await urlStatusCode(thumbnail) === 404) {
                thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
            }

            /* Create the model in the database */
            video = await db.Video.create({
                name: info.videoDetails.title,
                description: info.videoDetails.description,
                uri: url,
                thumbnail: thumbnail,
                videoID: id,
            });
        } else {
            Logger.verbose('Commands', 1, '[YouTube] Video "' + id + '" found in database!', 'blueBright');
        }

        if (!fs.existsSync(YouTube.getCachePath(id))) {
            Logger.verbose('Commands', 1, '[YouTube] Video "' + id + '" is not cached. Downloading...', 'blueBright');
            await YouTube.ytdlPromised(url, YouTube.getCachePath(id));
        }

        return video;
    }

    static ytdlPromised(url, path) {
        return new Promise((resolve, reject) => {
            const stream = ytdl(url, { quality: 'highestaudio' });
            stream.pipe(fs.createWriteStream(path));
            stream.on('finish', () => {
                resolve()
            });
            stream.on('error', e => {
                Logger.verbose('Commands', 1, '[YouTube] YouTubeDL failed, exception: "' + e + '"', 'red');

                reject(e)
            })
        });
        
    }

    static getCachePath(id) {
        return path.resolve(process.cwd() + '/cache/youtube/' + md5(id) + '.mp3');
    }
}

module.exports = YouTube;