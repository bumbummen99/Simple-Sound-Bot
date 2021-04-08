const md5 = require("md5");
const path = require('path');
const YouTube = require("../YouTube");
const ytsr = require('ytsr');
const AbstractCommand = require("./AbstractCommand");

class PlayerCommand extends AbstractCommand {
    async getAudioData(input) {
        let cachePath = null;
        let name = null;
        let url = null;
        
        /* Not an URL, try to search YouTube */
        if (!input.startsWith('http')) {
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
            console.log('DATA: ' + JSON.stringify(results.items));

            input = results.items[0].url;
        }

        /* We have an URL, check what service is being requested */

        /* Check if is YouTube URL */
        if (YouTube.getIdFromURL(input)) {
            cachePath = path.resolve(process.cwd() + '/cache/youtube/' + md5(YouTube.getIdFromURL(input)) + '.mp3');
            const video = await YouTube.download(input, cachePath);
            name = video.name;
            url = video.url;
        }

        /* Check if URL is Spotify */
        //TODO

        /* Check if URL is SoundCloud */
        //TODO

        if (cachePath) {
            return {
                path: cachePath,
                name: name,
                url: url
            }
        } else {
            return null;
        }
    }
}

module.exports = PlayerCommand;
