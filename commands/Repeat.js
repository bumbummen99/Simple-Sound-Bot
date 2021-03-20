const AbstractCommand = require('../core/abstract/AbstractCommand.js');
const AudioClient = require('../core/AudioClient.js');

class RepeatCommand extends AbstractCommand {
    constructor() {
        super('repeat', {
           aliases: ['repeat'] 
        });
    }

    async childExec(message) {
        const state = AudioClient.getInstance().toggleRepeat();

        message.reply((state ? 'Enabled' : 'Disabled') + ' track repeat.');
    }
}

module.exports = RepeatCommand;