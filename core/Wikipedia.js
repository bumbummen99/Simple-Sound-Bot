const fs = require('fs');
const path = require('path')
const wiki = require('wikipedia').default;
const md5 = require('md5');;
const FileSystem = require('./FileSystem');

let language = 'en';

class WikiPedia {
    static async setLanguage(lng) {
        /* Fetch the languages available on wikipedia */
        const languages = await wiki.languages();

        for (const languageResult of languages) {
            if (Object.keys(languageResult).includes(lng)) {
                await wiki.setLang(lng);
                language = lng;
                break;
            }
        }
    }

    static async getPageData(title) {
        return await WikiPedia._loadPageData(title);
    }

    static async _loadPageData(title) {
        /* Check if Cache-File does not exist or is too old */
        let pageData = null;

        if (FileSystem.fileOlderThan(WikiPedia.getCachePath(title), new Date() - (24 * 60 * 60))) {
            /* Fetch the Page */
            const page = await wiki.page(title);

            /* Get the summary */
            const summary = await page.summary();

            /* Get the intro text */
            const intro = await page.intro();

            /* Get the full page content */
            const content = await page.content();

            console.log(JSON.stringify(summary));

            /* Build the pageData object from the received data */
            pageData = {
                url: page.fullurl,
                title: page.title,
                image: (summary.originalimage ? summary.originalimage.source : null) ?? null,
                extract: summary.extract,
                intro: intro,
                content: content,
            };

            /* Cache the received data */
            fs.writeFileSync(WikiPedia.getCachePath(title), JSON.stringify(pageData));
        } else {
            /* Read the cached data from the cache file */
            pageData =JSON.parse(fs.readFileSync(WikiPedia.getCachePath(title), 'utf8'));
        }

        return pageData;
    }

    static getCachePath(page) {
        return path.resolve(process.cwd() + '/cache/wikipedia/' + md5(language + page) + '.json');
    }

    static generateEmbed(pageData) {
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

module.exports = WikiPedia;