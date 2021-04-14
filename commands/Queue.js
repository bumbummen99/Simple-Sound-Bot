const CommandHelper = require('../core/CommandHelper.js');
const AudioClient = require('../core/AudioClient/AudioClient.js');
const Logger = require('../core/Logger.js');
const PlayerCommand = require('../core/Commands/PlayerCommand.js');

class QueueCommand extends PlayerCommand {
    constructor() {
        super('queue', {
           aliases: ['queue'] 
        });
    }

    async playerExec(message, audioClient) {
        /* Get YouTube URLfrom the message */
        const input = CommandHelper.getCleared(this.id, message);

        Logger.verbose('Commands', 1, '[Queue] Queue command received. Input: "' + input + '"');

        /* If no URL has been supplied we have to check if the AudioClient is paused and can be resumed */
        if (!input.length) {
            Logger.verbose('Commands', 1, '[Play] No input provided :(');
            return message.util.reply('Please provide a valid input to queue something.');
        } else {
            /* Try to extract the videoID from the URL */
            const audioData = await this.getAudioData(input);

            /* Verify that we have the videoID and thereby a valid YouTube URL */
            if (!audioData) {
                Logger.verbose('Commands', 1, '[Queue] Provided input is invalid. No results for input: "' + input + '"', 'yellow');
                return message.util.reply('Sorry, i could not find anything for "' + input + '"!');
            }

            Logger.verbose('Commands', 1, '[Queue] Trying to play "' + audioData.name + '" from path "' + audioData.path + '"');
            await audioClient.queue(audioData.path, audioData.name);

            message.util.reply('Added "' + audioData.name + '" to the queue.');
        }
    }  
}

module.exports = QueueCommand;