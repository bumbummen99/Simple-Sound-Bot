const { Command } = require('discord-akairo');
const Logger = require('../Logger');

class AbstractCommand extends Command {
    async exec(message, args) {
        let allow = true;
        if (process.env.DISCORD_BOT_COMMAND_Channel.length) {
            Logger.verbose('Commands', 1, '[AbstractCommand] Command channels restricted, testing for "' + process.env.DISCORD_BOT_COMMAND_Channel.split(',').join(', ') + '".');
            allow = false;
            for (let cid of process.env.DISCORD_BOT_COMMAND_Channel.split(',')) {
                if (message.channel.id === cid) {
                    allow = true;
                    Logger.verbose('Commands', 1, '[AbstractCommand] Posted in configured channel, proceeding...');
                    break;
                }
            }
        }

        if (allow || this.isAllowed()) {
            return this.childExec(message, args);
        } else {
            Logger.verbose('Commands', 1, '[AbstractCommand] Posted in not allowed channel, cancelling!');
            return message.reply('You can\'t do that here.');
        }
    }

    getCleared(message) {
        const prefixes = Array.isArray(this.prefix) ? this.prefix : [this.prefix];
        for (const prefix of prefixes) {
            if (message.cleanContent.startsWith(prefix)) {
                return 
            }
        }
        Logger.verbose('CommandHelper', 2, 'Trying to clear command with prefix "' + process.env.DISCORD_BOT_COMMAND_PREFIX + '" and command "' + prefix + '".');
        return message.cleanContent.replace(process.env.DISCORD_BOT_COMMAND_PREFIX + prefix, '').trim();
    }

    childExec(message) {
        return message.reply('Not implemented :(');
    }

    isAllowed() {
        return false;
    }
}

module.exports = AbstractCommand;