const md5 = require("md5");
const path = require('path');
const YouTube = require("../YouTube");
const ytsr = require('ytsr');
const AbstractCommand = require("./AbstractCommand");
const GuildsManager = require("../AudioClient/GuildsManger");

class PlayerCommand extends AbstractCommand {
    getAudioClientForGuild(message) {
        if (message.guild) {
            return GuildsManager.get(message.guild.id);
        }
        
        return null;
    }

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

    childExec(message) {
        if (!message.guild) {
            return this.playerExec(message, this.getAudioClientForGuild(message.guild.id));
        } else {
            return message.util.reply('This command can only be run on a server.');
        }
    }

    playerExec(message, audioClient) {
        throw new Error('Not implemented!');
    }
}

module.exports = PlayerCommand;
