const AbstractCommand = require('../core/abstract/AbstractCommand.js');
const CommandHelper = require('../core/CommandHelper.js');
const AudioClient = require('../core/AudioClient.js');
const YouTube = require('../core/YouTube.js');
const Logger = require('../core/Logger.js');

class QueueCommand extends AbstractCommand {
    constructor() {
        super('queue', {
           aliases: ['queue'] 
        });
    }

    async childExec(message) {
        /* Get YouTube URLfrom the message */
        const url = CommandHelper.getCleared(this.id, message);

        Logger.verbose('Commands', 1, '[Queue] Queue command received. Input: "' + url + '"');

        /* If no URL has been supplied we have to check if the AudioClient is paused and can be resumed */
        if (!url.length) {
            Logger.verbose('Commands', 1, '[Play] No URL provided :(');
            return message.reply('There is nothing queue.');
        } else {
            /* Try to extract the videoID from the URL */
            const videoId = YouTube.getIdFromURL(url);

            /* Verify that we have the videoID and thereby a valid YouTube URL */
            if (!videoId) {
                Logger.verbose('Commands', 1, '[Queue] Provided URL is invalid. URL: "' + url + '"');
                return message.reply('That is not a valid YouTube URl!')
            }

            Logger.verbose('Commands', 1, '[Queue] Provied URL with ID: "' + videoId + '"');
            const video = await YouTube.download(url);

            Logger.verbose('Commands', 1, '[Queue] Trying to play "' + videoId + '" from path "' + YouTube.getCachePath(videoId) + '"');
            await AudioClient.getInstance().queue(YouTube.getCachePath(videoId), video.name);

            message.reply('Added "' + video.name + '" to the queue.');
        }
    }  
}

module.exports =QueueCommand;