const PlayerCommand = require('../core/Commands/PlayerCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js');
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');

class PlayCommand extends PlayerCommand {
    constructor() {
        super('play', {
           aliases: ['play'] 
        });
    }

    async childExec(message) {
        /* Get YouTube URLfrom the message */
        const input = CommandHelper.getCleared(this.id, message);

        Logger.verbose('Commands', 1, '[Play] Play command received. Input: "' + input + '"');

        /* If no URL has been supplied we have to check if the AudioClient is paused and can be resumed */
        if (!input.length) {
            if (AudioClient.getInstance().isPaused()) {
                Logger.verbose('Commands', 1, '[Play] No input provided, trying to resume playback.');
                await AudioClient.getInstance().resume();
            } else {
                Logger.verbose('Commands', 1, '[Play] No input provided and nothing to resume :(', 'yellow');
                return message.reply('There is nothing to resume, please provide a valid input to play something.');
            }
        } else {
            /* Try to extract the videoID from the URL */
            const audioData = await this.getAudioData(input);

            /* Verify that we have the videoID and thereby a valid YouTube URL */
            if (!audioData) {
                Logger.verbose('Commands', 1, '[Play] No results found for: "' + input + '"', 'yellow');
                return message.reply('No results found for: "' + input + '"');
            }

            Logger.verbose('Commands', 1, '[Play] Trying to play "' + audioData.name + '" from path "' + audioData.path + '"');
            AudioClient.getInstance().play(audioData.path);

            message.reply('Now playing "' + audioData.name + '".');
        }
    }
}

module.exports = PlayCommand;