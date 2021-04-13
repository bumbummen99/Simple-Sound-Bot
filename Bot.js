const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');

class Bot extends AkairoClient {
    constructor() {
        const akairoOptions = {};

        /* Get owner id(s) if available */
        if (process.env.DISCORD_BOT_OWNER) {
            akairoOptions.ownerID = process.env.DISCORD_BOT_OWNER.split(',')
        }

        super(akairoOptions, {
            // Options for discord.js goes here.
        });

        /* Setup the command handler */
        this.commandHandler = new CommandHandler(this, {
            directory: './commands/',
            prefix: process.env.DISCORD_BOT_COMMAND_PREFIX, // or ['?', '!']
            handleEdits: true,
            commandUtil: true,
        });
        this.commandHandler.loadAll();

        /* Setup the listeners handler */
        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler
        });
        this.listenerHandler.loadAll();
    }

    getUser() {
        return this.user;
    }
}

module.exports = Bot;