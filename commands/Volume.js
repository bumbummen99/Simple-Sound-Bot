const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js'); 
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');

class LeaveCommand extends AbstractCommand {
    constructor() {
        super('volume', {
           aliases: ['volume'] 
        });
    }

    async childExec(message) {
        /* Try to get the volume from the command */
        const input = CommandHelper.getCleared(this.id, message);

        Logger.verbose('Commands', 1, '[Volume] Volume command receive. Value: "' + input + '"');

        /* Multiply by one to parse to int/float or NaN */
        let volume = input * 1

        /* Check if the input could be parsed */
        if (isNaN(volume)) {
            Logger.verbose('Commands', 1, '[Volume] Invalid volume parameter, must be a number (int or float).', 'yellow');
            return message.reply('Invalid parameter value. Volume must be a number like "0.5", "1", "50" or "100".');
        }

        /* Normalize the input to float instead of int */
        if (volume > 1) {
            volume = Math.max(Math.min(volume, 100), 0) / 100;
        } else {
            volume = Math.max(Math.min(volume, 1), 0);
        }

        Logger.verbose('Commands', 1, '[Volume] Input normalized to: "' + volume + '"');

        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Join the message authors channel */
        await voice.volume(volume);

        Logger.verbose('Commands', 1, '[Volume] Set volume to "' + volume + '".');
        return message.reply('Set bot volume to "' + volume + '"');
    }
}

module.exports = LeaveCommand;