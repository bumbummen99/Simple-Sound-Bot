const { Command } = require('discord-akairo');
const Logger = require('../Services/Logger');

class AbstractCommand extends Command {
    async exec(message, args) {
        let allow = true;
        if (process.env.DISCORD_BOT_COMMAND_Channel.length) {
            Logger.getInstance().verbose('Commands', 1, '[AbstractCommand] Command channels restricted, testing for "' + process.env.DISCORD_BOT_COMMAND_Channel.split(',').join(', ') + '".');
            allow = false;
            for (let cid of process.env.DISCORD_BOT_COMMAND_Channel.split(',')) {
                if (message.channel.id === cid) {
                    allow = true;
                    Logger.getInstance().verbose('Commands', 1, '[AbstractCommand] Posted in configured channel, proceeding...');
                    break;
                }
            }
        }

        if (allow || this.isAllowed()) {
            return this.childExec(message, args);
        } else {
            Logger.getInstance().verbose('Commands', 1, '[AbstractCommand] Posted in not allowed channel, cancelling!');
            return message.reply('You can\'t do that here.');
        }
    }

    childExec(message) {
        return message.reply('Not implemented :(');
    }

    isAllowed() {
        return false;
    }
}

module.exports = AbstractCommand;