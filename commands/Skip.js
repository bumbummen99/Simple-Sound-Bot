const AbstractCommand = require('../core/abstract/AbstractCommand.js');
const AudioClient = require('../core/AudioClient.js');
const Logger = require('../core/Logger.js');

class SkipCommand extends AbstractCommand {
    constructor() {
        super('skip', {
           aliases: ['skip'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Skip] Skip command received, Skip playback...');

        await AudioClient.getInstance().skip();

        message.reply('Doing as you demand...');
    }
}

module.exports = SkipCommand;