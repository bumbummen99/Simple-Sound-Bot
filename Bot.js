import Akairo from "discord-akairo";
const { AkairoClient } = Akairo;

export default class Bot extends AkairoClient {
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
            prefix: process.env.DISCORD_BOT_COMMAND_PREFIX // or ['?', '!']
        });
        this.commandHandler.loadAll();
    }
}

