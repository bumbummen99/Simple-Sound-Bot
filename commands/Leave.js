const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js'); 
const Logger = require('../core/Logger.js');

class LeaveCommand extends AbstractCommand {
    constructor() {
        super('leave', {
           aliases: ['leave'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Leave] Leave command received, leaving...');

        /* Disconnect the AudioClient */
        await AudioClient.leave();

        Logger.verbose('Commands', 1, '[Leave] Bot left the current channel.');
    }
}

module.exports = LeaveCommand;