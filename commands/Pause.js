const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js');
const Logger = require('../core/Logger.js');

class PauseCommand extends AbstractCommand {
    constructor() {
        super('pause', {
           aliases: ['pause'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Pause] Pause command received, pausing playback...');

        AudioClient.pause();

        message.util.reply('Doing as you demand...');
    }
}

module.exports = PauseCommand;