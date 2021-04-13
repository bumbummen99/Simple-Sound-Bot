const { Listener } = require('discord-akairo');
const Bot = require('../Bot');
const AudioClient = require('../core/AudioClient/AudioClient');
const Logger = require('../core/Logger');
const PollyTTS = require('../core/PollyTTS');

class VoiceStateUpdateListener extends Listener {
    constructor() {
        super('voiceStateUpdate', {
            emitter: 'client',
            event: 'voiceStateUpdate'
        });
    }

    exec(oldState, newState) {
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
    }

    _detectBotOrSelf(states = []) {
        for (const state of states) {
            if (state.member && this.client.user && (state.member.id === this.client.user.id)) {
                return true;
            }
        }

        return false;
    } 

    _greetUser(newState) {
        /* Check if the greet feature is enabled and if the user joined the right channel */
        if (process.env.WELCOME_TEMPLATE && AudioClient.getVoiceChannel() && newState.channel.id === AudioClient.getVoiceChannel().id) {
            /* Play with delay to ensure the client is fully connected and can hear */
            setTimeout(async () => {
                AudioClient.playBetween(await PollyTTS.generate(process.env.WELCOME_TEMPLATE.replace(':user', newState.member.displayName)));
            }, 333);
        }
    }
}

module.exports = VoiceStateUpdateListener;
