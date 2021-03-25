const AbstractCommand = require('../core/abstract/AbstractCommand.js');
const CommandHelper = require('../core/CommandHelper.js');
const Logger = require('../core/Logger.js');
const String = require('../core/String.js');
const WikiPedia = require('../core/Wikipedia.js');

class WikiCommand extends AbstractCommand {
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
        const pageData = await WikiPedia.getPageData(title);

        /* Post an embed with the data */
        message.reply({embed: {
            color: 3447003,
            title: (pageData.title ? pageData.title : null) ?? text,
            thumbnail: {
                url: pageData.image,
            },
            url: pageData.url,
            description: String.excerpt(pageData.intro, 2048),
            timestamp: new Date(),
          }
        });
    }
}

module.exports = WikiCommand;