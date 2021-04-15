const PollyTTS = require('../core/PollyTTS.js');
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');
const WikiPedia = require('../core/Wikipedia.js');
const PlayerCommand = require('../core/Commands/PlayerCommand.js');

class TTSWikiCommand extends PlayerCommand {
    constructor() {
        super('ttswiki', {
            aliases: ['ttswiki'],
            args: [
                {
                    id: 'title',
                    type: 'string',
                    default: ''
                },
            ]
        });
    }

    async playerExec(message, args) {
        Logger.verbose('Commands', 1, '[TTSWiki] TTSWiki command received. Input: "' + args.title + '"');

        /* Get the WikiPedia page data */
        let pageData = null;
        try {
            pageData = await WikiPedia.getPageData(args.title);
        } catch (e) {
            /* Check if there was an error getting the page */
            if (e.name === 'pageError' && e.message.includes('No page with given title exists :')) {
                return message.util.reply('Could not find any page for "' + args.title + '".');
            }

            /* Just re-throw unhandled errors */
            throw e;
        }

        /* Generate or load the audio file */
        const audioFile = await PollyTTS.generate(pageData.intro);

        const audioClient = this.getAudioClientForGuild(message.guild.id);

        /* Play the generated audio file */
        Logger.verbose('Commands', 1, '[TTSWiki] Playing input from: "' + audioFile + '"');
        audioClient.playBetween(audioFile);

        /* Post an embed with the data */
        message.util.reply(WikiPedia.generateEmbed(pageData));
    }
}

module.exports = TTSWikiCommand;