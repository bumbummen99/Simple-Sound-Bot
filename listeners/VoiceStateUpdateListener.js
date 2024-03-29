const { Listener } = require('@skyraptor/discord-akairo');
const AudioClient = require('../core/AudioClient/AudioClient');
const GuildsManger = require('../core/AudioClient/GuildsManger');
const Logger = require('../core/Services/Logger');
const PollyTTS = require('../core/Utils/PollyTTS');

class VoiceStateUpdateListener extends Listener {
    constructor() {
        super('voiceStateUpdate', {
            emitter: 'client',
            event: 'voiceStateUpdate'
        });

        this._leaveTimeout = null;
    }

    exec(oldState, newState) {
        /* Check if the audio client(s) channel is populated */
        if (this._detectChannelSwitched(oldState, newState)) {
            for (const guildId of this._getGuildIds([oldState, newState])) {
                /* Check if there is an AudioClient for the guild */
                if (GuildsManger.has(guildId)) {
                    /* Get the guilds AudioClient */
                    const audioClient = GuildsManger.get(guildId);
    
                    /* Check if the Bot is the only one left in the channel */
                    if (audioClient.getVoiceChannel()) {
                        if (audioClient.getVoiceChannel().members.size <= 1) {
                            Logger.getInstance().verbose('Bot', 2, 'Bot-Channel is empty.');
                            
                            if (!GuildsManger.isPersistent(guildId)) {
                                GuildsManger.startTimeout(guildId);
                            }
                        } else {
                            Logger.getInstance().verbose('Bot', 2, 'Bot-Channel not empty.');
        
                            GuildsManger.stopTimeout(guildId);
                        } 
                    }
                }
            }
        }

        /* Handle other clients events */
        if (!this._detectSelf([oldState, newState])) {
            /* Detec it user connected to channel */
            if (oldState.channel === null) {
                Logger.getInstance().verbose('Bot', 2, 'User "' + newState.member.displayName + '" connected to channel ' + newState.channel.id + '.');
                
                this._connected(newState);
            } 
            
            /* Detect if user disconnected from channel */
            else if (newState.channel === null) {
                Logger.getInstance().verbose('Bot', 2, 'User "' + oldState.member.displayName + '" disconnected from channel ' + oldState.channel.id + '.');

                this._disconnected(oldState);
            }
            
            /* Detect if user moved between channels */
            else if (oldState.channel !== null && newState.channel !== null && oldState.channel.id !== newState.channel.id) {
                Logger.getInstance().verbose('Bot', 2, 'User "' + oldState.member.displayName + '" moved to channel ' + newState.channel.id + ' from ' + oldState.channel.id + '.');

                this._movedChannel(oldState, newState);
            }
        }
    }

    _connected(state) {
        if (GuildsManger.has(state.guild.id)) {
            const audioClient = GuildsManger.get(state.guild.id);

            /* Greet the User */
            this._greetUser(audioClient, state);
        }
        
    }

    _disconnected(state) {

    }

    _movedChannel(oldState, newState) {
        /* Handle new channel */
        if (GuildsManger.has(newState.guild.id)) {
            const audioClient = GuildsManger.get(newState.guild.id);

            /* Greet the User */
            this._greetUser(audioClient, newState);
        }
    }

    _detectChannelSwitched(oldState, newState) {
        return (oldState.channel === null) ||
              (newState.channel === null) ||
              (oldState.channel !== null && newState.channel !== null && oldState.channel.id !== newState.channel.id);
    }

    _detectSelf(states = []) {
        for (const state of states) {
            if (state.member && this.client.user && (state.member.id === this.client.user.id)) {
                return true;
            }
        }

        return false;
    }

    _getGuildIds(states = []) {
        const out = [];
        for (const state of states) {
            if (state.guild && !out.includes(state.guild.id)) {
                out.push(state.guild.id)
            }
        }

        return out;
    }

    _greetUser(audioClient, newState) {
        /* Check if the greet feature is enabled and if the user joined the right channel */
        if (process.env.WELCOME_TEMPLATE && audioClient.getVoiceChannel() && newState.channel.id === audioClient.getVoiceChannel().id) {
            /* Play with delay to ensure the client is fully connected and can hear */
            setTimeout(async () => {
                audioClient.playBetween(await PollyTTS.generate(process.env.WELCOME_TEMPLATE.replace(':user', newState.member.displayName)));
            }, 333);
        }
    }
}

module.exports = VoiceStateUpdateListener;
