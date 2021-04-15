const CommandHelper = require('../core/CommandHelper.js');
const AudioClient = require('../core/AudioClient/AudioClient.js');
const Logger = require('../core/Logger.js');
const PlayerCommand = require('../core/Commands/PlayerCommand.js');
const Queue = require('../core/Player/Queue.js');

class QueueCommand extends PlayerCommand {
    constructor() {
        super('queue', {
            aliases: ['queue'],
            args: [
                {
                    id: 'input',
                    type: 'string',
                    default: ''
                },
            ]
        });
    }

    async playerExec(message, args) {
        Logger.verbose('Commands', 1, '[Queue] Queue command received. Input: "' + args.input + '"');

        const audioClient = this.getAudioClientForGuild(message.guild.id);

        /* If no URL has been supplied we have to check if the AudioClient is paused and can be resumed */
        if (!args.input.length) {
            Logger.verbose('Commands', 1, '[Play] No input provided :(');
            return message.util.reply('Please provide a valid input to queue something.');
        } else {
            /* Try to extract the videoID from the URL */
            const trackData = await this.getTrackData(args.input);

            /* Verify that we have the videoID and thereby a valid YouTube URL */
            if (!trackData) {
                Logger.verbose('Commands', 1, '[Queue] Provided input is invalid. No results for input: "' + args.input + '"', 'yellow');
                return message.util.reply('Sorry, i could not find anything for "' + args.input + '"!');
            }

            Logger.verbose('Commands', 1, '[Queue] Trying to play "' + trackData.getName() + '" from path "' + trackData.getPath() + '"');
            Queue.queue(message.guild.id, message.member.id, trackData.getPath(), trackData.getName())
            await audioClient.queue(trackData.getPath(), trackData.getName());

            message.util.reply('Added "' + trackData.getName() + '" to the queue.');
        }
    }  
}

module.exports = QueueCommand;