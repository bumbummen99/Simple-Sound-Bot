const WikipediaCommand = require('../core/Commands/WikipediaCommand.js');
const AudioClient = require('../core/AudioClient/AudioClient.js'); 
const PollyTTS = require('../core/PollyTTS.js');
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');

class TTSWikiCommand extends WikipediaCommand {
    constructor() {
        super('ttswiki', {
           aliases: ['ttswiki'] 
        });
    }

    async childExec(message) {
        /* Get the WikiPedia page title or search term from the command message */
        const title = CommandHelper.getCleared(this.id, message);
        Logger.verbose('Commands', 1, '[TTSWiki] TTSWiki command received. Input: "' + title + '"');

        /* Get the WikiPedia page data */
        let pageData = null;
        try {
            pageData = await this.getPageData(title);
        } catch (e) {
            /* Check if there was an error getting the page */
            if (e.name === 'pageError' && e.message.includes('No page with given title exists :')) {
                return message.util.reply('Could not find any page for "' + title + '".');
            }

            /* Just re-throw unhandled errors */
            throw e;
        }

        /* Generate or load the audio file */
        const audioFile = await PollyTTS.generate(pageData.intro);

        /* Play the generated audio file */
        Logger.verbose('Commands', 1, '[TTSWiki] Playing input from: "' + audioFile + '"');
        AudioClient.playBetween(audioFile);

        /* Post an embed with the data */
        message.util.reply(this.generateEmbed(pageData));
    }
}

module.exports = TTSWikiCommand;