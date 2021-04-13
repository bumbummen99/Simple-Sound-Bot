const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js');

class RepeatCommand extends AbstractCommand {
    constructor() {
        super('repeat', {
           aliases: ['repeat'] 
        });
    }

    async childExec(message) {
        const state = AudioClient.toggleRepeat();

        message.reply((state ? 'Enabled' : 'Disabled') + ' track repeat.');
    }
}

module.exports = RepeatCommand;