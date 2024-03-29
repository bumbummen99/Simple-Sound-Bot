const PollyTTS = require('../core/Utils/PollyTTS.js');
const Logger = require('../core/Services/Logger.js');
const PlayerCommand = require('../core/Commands/PlayerCommand.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

class SummonCommand extends PlayerCommand {
    constructor() {
        super('summon', {
            aliases: ['summon'],
            channel: 'guild',
        });
    }

    async childExec(message) {
        Logger.getInstance().verbose('Commands', 1, '[Summon] Summon command received.');

        /* Check if the author is in a voice channel */
        if (!message.member.voice.channel) {
            message.util.reply('You are not in a voice channel!');
        }

        const audioClient = this.getAudioClientForGuild(message.guild.id);

        /* Join the message authors channel */
        audioClient.join(message.member.voice.channel);   
        
        /* Greet the channel with a slight delay */
        setTimeout(async () => {
            audioClient.playBetween(await PollyTTS.generate(process.env.GREET_TEMPLATE));
        }, 500);
        
        Logger.getInstance().verbose('Commands', 1, '[Summon] Summoned the bot.');
    }
}

module.exports = SummonCommand;