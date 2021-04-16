const md5 = require("md5");
const path = require('path');
const YouTube = require("../YouTube");
const ytsr = require('ytsr');
const AbstractCommand = require("./AbstractCommand");
const GuildsManager = require("../AudioClient/GuildsManger");
const TrackData = require("../Data/TrackData");

class PlayerCommand extends AbstractCommand {
    getAudioClientForGuild(guildId) {
        return GuildsManager.get(guildId);
    }

    async getTrackData(input) {       
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

            input = results.items[0].url;
        }

        /* We have an URL, check what service is being requested */

        /* Check if is YouTube URL */
        if (YouTube.getIdFromURL(input)) {
            const cachePath = path.resolve(process.cwd() + '/cache/youtube/' + md5(YouTube.getIdFromURL(input)) + '.mp3');
            const video = await YouTube.download(input, cachePath);

            return new TrackData(cachePath, video.uri, video.name, video.description, video.thumbnail);
        }

        /* Check if URL is Spotify */
        //TODO

        /* Check if URL is SoundCloud */
        //TODO

        return null;
    }

    childExec(message, args) {
        throw new Error('Not implemented!');
    }
}

module.exports = PlayerCommand;
