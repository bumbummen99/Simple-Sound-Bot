const String = require('../Helpers/String');
const Logger = require('../Logger');

class TrackData {
    constructor(path, url, name, description = null, thumbnail = null) {
        this._path = path;
        this._url = url;
        this._name = name;
        this._description = description;
        this._thumbnail = thumbnail;
        
        Logger.verbose('TrackData', 4, `TrackData created with URL: "${url}", Name: "${name}", Desc: "${String.excerpt(this._description ?? '', 20)}", Image: "${thumbnail}"`)
    }

    getPath() {
        return this._path;
    }

    getName() {
        return this._name;
    }

    getEmbed() {
        return {
            embed: {
                color: 3447003,
                url: this._url,
                title: `Now playing: "${this._name}"`,
                image: {
                    url: this._thumbnail ?? '',
                },
                description: String.excerpt(this._description ?? '', 512),
                timestamp: new Date(),
            }
        }
    }
}

module.exports = TrackData;