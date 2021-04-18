const md5 = require('md5');
const fs = require('fs')
const path = require('path');

const db = require('../../../models/index.js');
const Logger = require('../../Services/Logger.js');
const YouTubeDL = require('./Abstracts/YouTubeDL.js');
const SpotifyWebAPI = require('../../Services/SpotifyWebAPI.js');

class Spotify extends YouTubeDL {
    static getIdFromURL(url) {
        if (url != undefined || url != '') {
            /* Try to get the ID from the Spotify Track URL */
            const match = url.match(/^https:\/\/open\.spotify\.com\/track\/([A-Za-z0-9]+)\?si=([A-Za-z0-9_]+)$/);
            
            if (match && match[1].length == 22) {
                Logger.getInstance().verbose('YouTubeDL', 4, `[Spotify] Extracted song ID ${match[0]} from URL "${url}"`, 'green');

                return match[1];
            }
        }

        Logger.getInstance().verbose('YouTubeDL', 4, `[Spotify] Could not extract song ID from URL "${url}"`, 'red');

        return null;
    }

    static async download(url) {
        const id = Spotify.getIdFromURL(url);

        /* Try to find the video information */
        let track = await db.Spotify.findOne({
            where: {
                trackId: id,
            }
        });

        if (!track) {
            Logger.getInstance().verbose('YouTubeDL', 1, '[Spotify] Song "' + id + '" not in database, retrieving information...', 'blueBright');

            /* Fetch the track info with spotify WebAPI */
            const info = await SpotifyWebAPI.getInstance().getClient().getTrack(id);

            /* Create the model in the database */
            track = await db.Spotify.create({
                trackId: id,
                name: info.body.name,
                thumbnail: info.body.album.images[0].url,
            });
        } else {
            Logger.getInstance().verbose('YoUTubeDL', 1, '[Spotify] Video "' + id + '" found in database!', 'blueBright');
        }

        if (!fs.existsSync(Spotify.getCachePath(id))) {
            Logger.getInstance().verbose('YouTubeDL', 1, '[Spotify] Video "' + id + '" is not cached. Downloading...', 'blueBright');
            await Spotify.ytdlPromised(url, Spotify.getCachePath(id));
        }

        return video;
    }

    static getCachePath(id) {
        return path.resolve(process.cwd() + '/cache/spotify/' + md5(id) + '.mp3');
    }
}

module.exports = Spotify;