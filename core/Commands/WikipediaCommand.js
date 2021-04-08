const String = require("../Helpers/String");
const WikiPedia = require("../Wikipedia");
const AbstractCommand = require("./AbstractCommand");

class WikipediaCommand extends AbstractCommand {
    getPageData(title) {
        return WikiPedia.getPageData(title);
    }

    generateEmbed(pageData) {
        return {
            embed: {
                color: 3447003,
                url: pageData.url,
                title: (pageData.title ? pageData.title : null) ?? text,
                image: {
                    url: pageData.image,
                },
                description: String.excerpt(pageData.extract, 2048),
                timestamp: new Date(),
            }
        }
    }
}

module.exports = WikipediaCommand;
