const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const ytdl = require('ytdl-core');
const { Command } = require('discord-akairo');

const AudioClient = require('../core/AudioClient.js');
const YouTube = require('../core/YouTube.js');

class TTSCommand extends Command {
    constructor() {
        super('play', {
           aliases: ['play'] 
        });
    }

    async exec(message) {
        /* Get YouTube URLfrom the message */
        const url = message.cleanContent.replace(process.env.DISCORD_BOT_COMMAND_PREFIX + 'play ', '');

        /* If no URL has been supplied we have to check if the AudioClient is paused and can be resumed */
        if (!url.length) {
            if (AudioClient.getInstance().isPaused()) {
                AudioClient.getInstance().resume();
            } else {
                return message.reply('There is nothing to resume, please provide a valid YouTube URL to play something.');
            }
        } else {
            /* Try to extract the videoID from the URL */
            const videoId = YouTube.getIdFromURL(url);

            /* Verify that we have the videoID and thereby a valid YouTube URL */
            if (!videoId) {
                return message.reply('That is not a valid YouTube URl!')
            }

            /* Generate the target cache path */
            const cachePath = path.resolve(process.cwd() + '/cache/youtube/' + md5(videoId) + '.mp3');

            /* Download the video if the video has not already been cached locally */
            if (!fs.existsSync(cachePath)) {
                ytdl('https://www.youtube.com/watch?v=ZlAU_w7-Xp8', { quality: 'highestaudio' }).pipe(fs.writeFileSync());
            }

            AudioClient.getInstance().play(cachePath);
        }

        message.reply('Doing as you demand...');
    }
}

module.exports = TTSCommand;