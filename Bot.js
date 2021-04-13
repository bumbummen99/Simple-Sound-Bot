const { AkairoClient, CommandHandler } = require('discord-akairo');
const AudioClient = require('./core/AudioClient/AudioClient.js');
const Logger = require('./core/Logger.js');

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
            prefix: process.env.DISCORD_BOT_COMMAND_PREFIX // or ['?', '!']
        });
        this.commandHandler.loadAll();

        /* Add handler to track channel join/leave eventss */
        this.on('voiceStateUpdate', (oldState, newState) => {  
            Logger.verbose('Bot', 2, 'Detected voiceStateUpdate event.');

            if (AudioClient.getVoiceChannel()) {
                const botVoiceChannel = AudioClient.getVoiceChannel();

                Logger.verbose('Bot', 2, 'Bot-Channel has ' + botVoiceChannel.members.size + ' users.');

                /* Check if the Bot is the only one left in the channel */
                if (botVoiceChannel.members.size <= 1) {
                    Logger.verbose('Bot', 2, 'Bot-Channel is empty, pausing.');
                    AudioClient.pause();
                } else {
                    Logger.verbose('Bot', 2, 'Bot-Channel has users, resuming.');
                    AudioClient.resume();
                }
            }
        });
    }
}

module.exports = Bot;