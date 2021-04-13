const WikipediaCommand = require('../core/Commands/WikipediaCommand.js');
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');

class WikiCommand extends WikipediaCommand {
    constructor() {
        super('wiki', {
           aliases: ['wiki'] 
        });
    }

    async childExec(message) {
        /* Get the TTS text from the message */
        const title = CommandHelper.getCleared(this.id, message);

        Logger.verbose('Commands', 1, '[Wiki] Wiki command received. Input: "' + title + '"');

        /* Fetch the page */
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

        /* Post an embed with the data */
        return message.util.reply(this.generateEmbed(pageData));
    }
}

module.exports = WikiCommand;