const AbstractCommand = require('../core/Commands/AbstractCommand.js');
const Logger = require('../core/Logger.js');

class HelpCommand extends AbstractCommand {
    constructor() {
        super('help', {
           aliases: ['help'] 
        });
    }

    async childExec(message) {
        Logger.verbose('Commands', 1, '[Commands] Commands command received, giving some info...');

        const prefix = process.env.DISCORD_BOT_COMMAND_PREFIX;

        return message.util.reply({
            embed: {
                color: 3447003,
                url: 'https://github.com/bumbummen99/Simple-Sound-Bot',
                title: `Simple Sound-Bot v${process.env.SOUND_BOT_VERSION} Help`,
                description: `${prefix}summon - Summons the bot to your current audio channel if you are in one.
                              ${prefix}leave - Makes the bot leave the audio channel it is currently connected to.
                              ${prefix}wiki - Respond with a matching Wikipedia article.
                              ${prefix}tts - Text to speech, no explanation needed
                              ${prefix}ttswiki <Page-Title or Search> - Text to speech for Wikipedia articles. Bullshit information right to your ears.
                              ${prefix}play - Plays a youtube video URL or search for a video, overrides current track. If no URL is provided it will resume the paused track.
                              ${prefix}repeat - Toggles the repeat functionailty. If enabled, the same track will play over and over.
                              ${prefix}queue - Pretty much the same as play, but will add the result to the queue.
                              ${prefix}skip - Skips the current track.
                              ${prefix}volume - sets the volume, use values like "0.5", "1", "50" or "100".`,
                timestamp: new Date(),
                footer: {
                    text: 'Simple Sound Bot created by SkyRaptor',
                    icon_url: 'https://skyraptor.eu/images/logo/skyraptor-color-logo.png',
                },
            }
        });;
    }

    isAllowed() {
        return true;
    }
}

module.exports = HelpCommand;