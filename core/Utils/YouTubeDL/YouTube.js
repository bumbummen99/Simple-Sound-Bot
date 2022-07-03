const md5 = require('md5');
const youtubedl = require('youtube-dl-exec')
const fs = require('fs')
const path = require('path');
const urlStatusCode = require('url-status-code')

const db = require('../../../models/index.js');
const Logger = require('../../Services/Logger.js');
const ytsr = require('ytsr');

class YouTube {

    static async search(input) {
        /* Not an URL, search YouTube */
        const results = await ytsr(input, {
            limit: 1,
            gl: process.env.YOUTUBE_COUNTRY ?? 'US',
            hl: process.env.YOUTUBE_LANGUAGE ?? 'en',
        });

        /* Return nothing if we found nothing */
        if (!results.items.length) {
            return null;
        }

        return results.items[0].url;
    }

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

    static async download(url) {
        const id = YouTube.getIdFromURL(url);

        /* Try to find the video information */
        let video = await db.YouTube.findOne({
            where: {
                videoId: id,
            }
        });

        if (!video) {
            Logger.getInstance().verbose('YouTubeDL', 1, '[YouTube] Video "' + id + '" not in database, retrieving information...', 'blueBright');

            /* Fetch the video info with youtube dl */
            const info = await youtubedl(url, { dumpSingleJson: true });

            /* Get corrent thumbnail url */
            let thumbnail = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
            if (await urlStatusCode(thumbnail) === 404) {
                thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
            }

            ///* Create the model in the database */
            video = await db.YouTube.create({
                videoId: id,
                name: info.title,
                description: info.description,
                thumbnail: thumbnail,
            });
        } else {
            Logger.getInstance().verbose('YouTubeDL', 1, '[YouTube] Video "' + id + '" found in database!', 'blueBright');
        }

        if (!fs.existsSync(YouTube.getCachePath(id))) {
            Logger.getInstance().verbose('YouTubeDL', 1, '[YouTube] Video "' + id + '" is not cached. Downloading...', 'blueBright');
            await youtubedl.exec(url, { output: YouTube.getCachePath(id) });
        }

        return video;
    }

    static getCachePath(id) {
        return path.resolve(process.cwd() + '/cache/youtube/' + md5(id) + '.mp3');
    }
}

module.exports = YouTube;