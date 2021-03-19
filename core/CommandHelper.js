const Logger = require("./Logger");

class CommandHelper {
    static getCleared(prefix, message) {
        Logger.verbose('CommandHelper', 1, 'Trying to clear command with prefix "' + process.env.DISCORD_BOT_COMMAND_PREFIX + '" and command "' + prefix + '".');
        return message.cleanContent.replace(process.env.DISCORD_BOT_COMMAND_PREFIX + prefix, '').trim();
    }
}

module.exports = CommandHelper;