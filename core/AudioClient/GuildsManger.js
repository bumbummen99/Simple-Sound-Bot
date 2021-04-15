const Logger = require("../Logger");
const AudioClient = require("./AudioClient");

class GuildsManager {
    constructor() {
        this._audioClients = new Map();

        this._persistentClients = {};

        this._leaveTimeouts = new Map();
    }

    has(guildId){
        return this._audioClients.has(guildId);
    }

    get(guildId) {
        if (!this._audioClients.has(guildId)) {
            this._audioClients.set(guildId, new AudioClient(guildId));

            Logger.verbose('GuildsManager', 1, `Created new AudioClient for guild ${guildId}.`);
        }

        return this._audioClients.get(guildId);
    }

    remove(guildId) {
        if (this._audioClients.has(guildId)) {
            const client = this._audioClients.get(guildId);
            client.leave();
        }

        this._audioClients.delete(guildId);

        Logger.verbose('GuildsManager', 1, `Removed AudioClient for guild ${guildId}.`);
    }

    togglePersistance(guildId, newState = !this.isPersistent(guildId)) {
        if (newState) {
            this._persistentClients[guildId] = true;

            /* Stop any possible timeout */
            this.stopTimeout(guildId);
        } else {
            delete this._persistentClients[guildId];

            /* Check if there is an audio client for the guild */
            if (this.has(guildId)) {
                const audioClient = this.get(guildId);

                /* Start the timeout if it has a channel that is empty */
                if (audioClient.getVoiceChannel() && audioClient.getVoiceChannel().members.size <= 1) {
                    this.startTimeout(guildId);
                }
            }
        }

        Logger.verbose('GuildsManager', 1, `${newState ? 'Enabled' : 'Disabled'} AudioClient persistance for guild ${guildId}.`);

        return newState;
    }

    isPersistent(guildId) {
        return this._persistentClients.hasOwnProperty(guildId);
    }

    startTimeout(guildId) {
        if (!this._leaveTimeouts.has(guildId)) {
            this._leaveTimeouts.set(guildId, setTimeout(() => {
                this.remove(guildId);
            }, 5 * 60 * 1000));

            Logger.verbose('GuildsManager', 1, `Started AudioClient leave timeout for guild ${guildId}.`);
        } else {
            Logger.verbose('GuildsManager', 3, `Cant start leave timeout, no AudioClient for guild ${guildId}.`);
        }
    }

    stopTimeout(guildId) {
        if (this._leaveTimeouts.has(guildId)) {
            clearTimeout(this._leaveTimeouts.get(guildId));

            this._leaveTimeouts.delete(guildId);

            Logger.verbose('GuildsManager', 1, `Stopped AudioClient leave timeout for guild ${guildId}.`);
        } else {
            Logger.verbose('GuildsManager', 3, `Cant stop leave timeout, no timeout for guild ${guildId}.`);
        }
    }

    destroy() {
        /* Disconnect and delete all AudioClients */
        for (const guildId of this._audioClients.keys()) {
            const audioClient = this._audioClients.get(guildId);

            audioClient.leave();

            this._audioClients.delete(guildId);
        }

        Logger.verbose('GuildsManager', 1, `Closed all AudioClients.`);
    }
}

module.exports = new GuildsManager();
