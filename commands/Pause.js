const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const Logger = require('../core/Logger.js');

class PauseCommand extends AbstractCommand {
    constructor() {
        super('pause', {
           aliases: ['pause'] 
        });
    }

    async playerExec(message, audioClient) {
        Logger.verbose('Commands', 1, '[Pause] Pause command received, pausing playback...');

        /* Pause the playback */
        audioClient.pause();

        message.util.reply('Doing as you demand...');
    }
}

module.exports = PauseCommand;