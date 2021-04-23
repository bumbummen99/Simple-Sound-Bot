const Logger = require('../core/Services/Logger.js');
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
                    default: '',
                    match: 'rest',
                },
            ],
            quoted: false,
            channel: 'guild',
        });
    }

    async childExec(message, args) {
        Logger.getInstance().verbose('Commands', 1, '[Queue] Queue command received. Input: "' + args.input + '"');

        /* If no URL has been supplied we have to check if the AudioClient is paused and can be resumed */
        if (!args.input.length) {
            Logger.getInstance().verbose('Commands', 1, '[Play] No input provided :(');
            return message.util.reply('Please provide a valid input to queue something.');
        } else {
            /* Try to extract the videoID from the URL */
            const trackData = await this.getTrackData(args.input);

            /* Verify that we have the videoID and thereby a valid YouTube URL */
            if (!trackData) {
                Logger.getInstance().verbose('Commands', 1, '[Queue] Provided input is invalid. No results for input: "' + args.input + '"', 'yellow');
                return message.util.reply('Sorry, i could not find anything for "' + args.input + '"!');
            }

            Logger.getInstance().verbose('Commands', 1, '[Queue] Trying to play "' + trackData.getName() + '" from path "' + trackData.getPath() + '"');
            await Queue.queue(message.guild.id, message.member.id, trackData.getPath(), trackData.getName())

            message.util.reply('Added "' + trackData.getName() + '" to the queue.');
        }
    }  
}

module.exports = QueueCommand;