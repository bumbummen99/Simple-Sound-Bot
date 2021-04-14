const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const Logger = require('../core/Logger.js');

class LeaveCommand extends AbstractCommand {
    constructor() {
        super('leave', {
           aliases: ['leave'] 
        });
    }

    async playerExec(message, audioClient) {
        Logger.verbose('Commands', 1, '[Leave] Leave command received, leaving...');

        /* Disconnect the AudioClient */
        await audioClient.leave();

        Logger.verbose('Commands', 1, '[Leave] Bot left the current channel.');

        message.util.reply('Screw you guys i\'m going home!');
    }
}

module.exports = LeaveCommand;