const Logger = require('../core/Logger.js');
const WikiPedia = require('../core/Wikipedia.js');
const AbstractCommand = require('../core/Commands/AbstractCommand.js');

class WikiCommand extends AbstractCommand {
    constructor() {
        super('wiki', {
            aliases: ['wiki'],
            args: [
                {
                    id: 'title',
                    type: 'string',
                    default: '',
                    match: 'rest',
                },
            ],
            quoted: false,
        });
    }

    async childExec(message, args) {
        Logger.verbose('Commands', 1, '[Wiki] Wiki command received. Input: "' + args.title + '"');

        /* Fetch the page */
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

        /* Post an embed with the data */
        return message.util.reply(WikiPedia.generateEmbed(pageData));
    }
}

module.exports = WikiCommand;