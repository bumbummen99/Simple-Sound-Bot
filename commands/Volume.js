const Logger = require('../core/Logger.js');
const PlayerCommand = require('../core/Commands/PlayerCommand.js');

class LeaveCommand extends PlayerCommand {
    constructor() {
        super('volume', {
            aliases: ['volume', 'vol'],
            args: [
                {
                    id: 'input',
                    type: 'number',
                    default: 1,
                    match: 'rest',
                },
            ],
            quoted: false,
            channel: 'guild',
        });
    }

    async childExec(message, args) {
        Logger.verbose('Commands', 1, '[Volume] Volume command receive. Value: "' + args.input + '"');

        /* Multiply by one to parse to int/float or NaN */
        let volume = args.input;// * 1

        /* Check if the input could be parsed */
        if (isNaN(volume)) {
            Logger.verbose('Commands', 1, '[Volume] Invalid volume parameter, must be a number (int or float).', 'yellow');
            return message.util.reply('Invalid parameter value. Volume must be a number like "0.5", "1", "50" or "100".');
        }

        /* Normalize the input to float instead of int */
        if (volume > 1) {
            volume = Math.max(Math.min(volume, 100), 0) / 100;
        } else {
            volume = Math.max(Math.min(volume, 1), 0);
        }

        Logger.verbose('Commands', 1, '[Volume] Input normalized to: "' + volume + '"');

        const audioClient = this.getAudioClientForGuild(message.guild.id);

        /* Set the volume on the AudioClient */
        await audioClient.volume(volume);

        Logger.verbose('Commands', 1, '[Volume] Set volume to "' + volume + '".');
        return message.util.reply('Set bot volume to "' + volume + '"');
    }
}

module.exports = LeaveCommand;