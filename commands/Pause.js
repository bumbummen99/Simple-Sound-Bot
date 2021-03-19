const AbstractCommand = require('../core/abstract/AbstractCommand.js');
const AudioClient = require('../core/AudioClient.js');
const Logger = require('../core/Logger.js');

class PauseCommand extends AbstractCommand {
    constructor() {
        super('pause', {
           aliases: ['pause'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Pause] Pause command received, pausing playback...');

        AudioClient.getInstance().pause();

        message.reply('Doing as you demand...');
    }
}

module.exports = PauseCommand;