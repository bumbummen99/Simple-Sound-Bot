const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const ytdl = require('ytdl-core');
const { Command } = require('discord-akairo');

const AudioClient = require('../core/AudioClient.js');
const YouTube = require('../core/YouTube.js');
const Logger = require('../core/Logger.js');

class PlayCommand extends Command {
    constructor() {
        super('play', {
           aliases: ['play'] 
        });
    }

    async exec(message) {
        /* Get YouTube URLfrom the message */
        const url = message.cleanContent.replace(process.env.DISCORD_BOT_COMMAND_PREFIX + 'play ', '');

        Logger.verbose('Commands', 1, '[Play] Play command received. Input: "' + url + '"');

        /* If no URL has been supplied we have to check if the AudioClient is paused and can be resumed */
        if (!url.length) {
            if (AudioClient.getInstance().isPaused()) {
                Logger.verbose('Commands', 1, '[Play] No URL provided, trying to resume playback.');
                AudioClient.getInstance().resume();
            } else {
                Logger.verbose('Commands', 1, '[Play] No URL provided and nothing to resume :(');
                return message.reply('There is nothing to resume, please provide a valid YouTube URL to play something.');
            }
        } else {

            /* Try to extract the videoID from the URL */
            const videoId = YouTube.getIdFromURL(url);

            /* Verify that we have the videoID and thereby a valid YouTube URL */
            if (!videoId) {
                Logger.verbose('Commands', 1, '[Play] Provided URL is invalid. URL: "' + url + '"');
                return message.reply('That is not a valid YouTube URl!')
            }

            Logger.verbose('Commands', 1, '[Play] Provied URL with ID: "' + videoId + '"');

            /* Generate the target cache path */
            const cachePath = path.resolve(process.cwd() + '/cache/youtube/' + md5(videoId) + '.mp3');

            /* Download the video if the video has not already been cached locally */
            if (!fs.existsSync(cachePath)) {
                Logger.verbose('Commands', 1, '[Play] Video "' + videoId + '" is not cached. Downloading...');
                ytdl(url, { quality: 'highestaudio' }).pipe(fs.createWriteStream(cachePath));
            }

            Logger.verbose('Commands', 1, '[Play] Trying to play "' + videoId + '" from path "' + cachePath + '"');
            AudioClient.getInstance().play(cachePath);
        }

        message.reply('Doing as you demand...');
    }
}

module.exports = PlayCommand;