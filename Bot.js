const { AkairoClient, CommandHandler } = require('discord-akairo');
const AudioClient = require('./core/AudioClient');
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
            Logger.verbose('Bot', 1, 'Detected voiceStateUpdate event.');

            Logger.verbose('Bot', 2, 'Event data: ' + JSON.stringify(newState));

            /* Check if the user left a channel */
            if (oldState.channel && (!newState.channel || newState.channel.id !== oldState.channel.id)){
                Logger.verbose('Bot', 2, 'User left a channel.');

                /* Save power and pause playback if no one is in the channel */
                if (oldState.channel.id === AudioClient.getInstance().getVoiceChannel()) {
                    if (!oldState.channel.members.length) {
                        Logger.verbose('Bot', 2, 'User left bot channel and channel is empty, pausing playback.');

                        AudioClient.getInstance().pause();
                    }
                }
            }

            if(newState.channel && (!oldState.channel || newState.channel.id !== oldState.channel.id)) {
                Logger.verbose('Bot', 2, 'User joined a channel.');

                /* Resume playback if someone joins the channel */
               if (newState.channel.id === AudioClient.getInstance().getVoiceChannel()) {
                    Logger.verbose('Bot', 2, 'User joined bot channel, resuming playback.');

                   AudioClient.getInstance().resume();
               }
            }
        });
    }
}

module.exports = Bot;