const path = require('path');
const md5 = require('md5');

const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js');
const YouTube = require('../core/YouTube.js');
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');

class PlayCommand extends AbstractCommand {
    constructor() {
        super('play', {
           aliases: ['play'] 
        });
    }

    async childExec(message) {
        /* Get YouTube URLfrom the message */
        const url = CommandHelper.getCleared(this.id, message);

        Logger.verbose('Commands', 1, '[Play] Play command received. Input: "' + url + '"');

        /* If no URL has been supplied we have to check if the AudioClient is paused and can be resumed */
        if (!url.length) {
            if (AudioClient.getInstance().isPaused()) {
                Logger.verbose('Commands', 1, '[Play] No URL provided, trying to resume playback.');
                await AudioClient.getInstance().resume();
            } else {
                Logger.verbose('Commands', 1, '[Play] No URL provided and nothing to resume :(', 'yellow');
                return message.reply('There is nothing to resume, please provide a valid YouTube URL to play something.');
            }
        } else {

            /* Try to extract the videoID from the URL */
            const videoId = YouTube.getIdFromURL(url);

            /* Verify that we have the videoID and thereby a valid YouTube URL */
            if (!videoId) {
                Logger.verbose('Commands', 1, '[Play] Provided URL is invalid. URL: "' + url + '"', 'yellow');
                return message.reply('That is not a valid YouTube URl!')
            }

            Logger.verbose('Commands', 1, '[Play] Provied URL with ID: "' + videoId + '"');

            /* Generate the target cache path */
            const cachePath = path.resolve(process.cwd() + '/cache/youtube/' + md5(videoId) + '.mp3');
            const video = await YouTube.download(url, cachePath);

            Logger.verbose('Commands', 1, '[Play] Trying to play "' + videoId + '" from path "' + cachePath + '"');
            AudioClient.getInstance().play(cachePath);

            message.reply('Now playing "' + video.name + '".');
        }
    }
}

module.exports = PlayCommand;