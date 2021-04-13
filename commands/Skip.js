const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js');
const Logger = require('../core/Logger.js');

class SkipCommand extends AbstractCommand {
    constructor() {
        super('skip', {
           aliases: ['skip'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Skip] Skip command received, Skip playback...');

        await AudioClient.skip();

        message.util.reply('Doing as you demand...');
    }
}

module.exports = SkipCommand;