const AbstractCommand = require('../core/abstract/AbstractCommand.js');
const AudioClient = require('../core/AudioClient.js'); 
const Logger = require('../core/Logger.js');

class LeaveCommand extends AbstractCommand {
    constructor() {
        super('leave', {
           aliases: ['leave'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Leave] Leave command received, leaving...');

        /* Get the AudioClient singleton */
        const voice = AudioClient.getInstance();

        /* Join the message authors channel */
        await voice.disconnect();

        Logger.verbose('Commands', 1, '[Leave] Bot left the current channel.');
    }
}

module.exports = LeaveCommand;