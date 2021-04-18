const SpotifyWebApi = require('spotify-web-api-node');
const ServiceContainer = require('../ServiceContainer');
const Logger = require('./Logger');

class SpotifyWebAPI {
    constructor() {
        this._client = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        });
    }

    getClient() {
        return this._client;
    }

    async auth() {
        try {
            const response = await this._client.clientCredentialsGrant();
    
            Logger.getInstance().verbose('Bootstrap', 1, `Received a new Spotify access token. Expires: ${response.body['expires_in']}`);
    
            this._client.setAccessToken(response.body['access_token']);
        } catch (err) {
            Logger.getInstance().verbose('Bootstrap', 1, `Something went wrong when retrieving an Spotify access token. CID: ${this._client.getClientId()}, CS: ${this._client.getClientSecret()}, Error: ${err}`);
        }
    }

    static getIdentifier() {
        return 'SpotifyWebAPI';
    }

    /**
     * @returns {SpotifyWebAPI}
     */
    static getInstance() {
        return ServiceContainer.get(SpotifyWebAPI.getIdentifier());
    }
}

module.exports = SpotifyWebAPI;