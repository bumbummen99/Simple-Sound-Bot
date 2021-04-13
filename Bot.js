const { AkairoClient, CommandHandler } = require('discord-akairo');
const AudioClient = require('./core/AudioClient/AudioClient.js');
const Logger = require('./core/Logger.js');
const PollyTTS = require('./core/PollyTTS.js');

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
            /* Ignore Bots and self */
            if (this._detectBotOrSelf([oldState, newState])) {
                Logger.verbose('Bot', 2, 'Detected Bot/self voiceStateUpdate event, ignoring.');
                return;
            } else {
                Logger.verbose('Bot', 2, 'Detected client voiceStateUpdate event.');
            }

            /* Check if the audio client channel(s) are populated */
            const botVoiceChannel = AudioClient.getVoiceChannel();
            if (botVoiceChannel) {
                /* Check if the Bot is the only one left in the channel */
                if (botVoiceChannel.members.size <= 1) {
                    Logger.verbose('Bot', 2, 'Bot-Channel is empty, pausing.');
                    AudioClient.pause();
                } else {
                    Logger.verbose('Bot', 2, 'Bot-Channel has users, resuming.');
                    AudioClient.resume();
                }
            }

            /* Detec it user connected to channel */
            if (oldState.channel === null) {
                Logger.verbose('Bot', 2, 'User "' + newState.member.displayName + '" connected to channel ' + newState.channel.id + '.');
                
                /* Greet the User */
                this._greetUser(newState);
            } 
            
            /* Detect if user disconnected from channel */
            else if (newState.channel === null) {
                Logger.verbose('Bot', 2, 'User "' + oldState.member.displayName + '" disconnected from channel ' + oldState.channel.id + '.');
            }
            
            /* Detect if user moved between channels */
            else if (oldState.channel !== null && newState.channel !== null) {
                Logger.verbose('Bot', 2, 'User "' + oldState.member.displayName + '" moved to channel ' + newState.channel.id + ' from ' + oldState.channel.id + '.');

                /* Greet the User */
                this._greetUser(newState);
            }
        });
    }

    _greetUser(newState) {
        if (process.env.GREET_TEMPLATE && AudioClient.getVoiceChannel() && newState.channel.id === AudioClient.getVoiceChannel().id) {
            setTimeout(async () => {
                AudioClient.playBetween(await PollyTTS.generate(process.env.GREET_TEMPLATE.replace(':user', newState.member.displayName)));
            }, 250);
        }
    }

    _detectBotOrSelf(states = []) {
        for (const state of states) {
            if (state.member && (state.member.id === this.user.id)) {
                return true;
            }
        }

        return false;
    } 
}

module.exports = Bot;