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
        }

        return this._audioClients.get(guildId);
    }

    remove(guildId) {
        if (this._audioClients.has(guildId)) {
            const client = this._audioClients.get(guildId);
            client.leave();
        }

        this._audioClients.delete(guildId);
    }

    togglePersistance(guildId, newState = !this.isPersistent(guildId)) {
        if (!newState) {
            this._persistentClients[guildId] = true;
        } else {
            delete this._persistentClients[guildId];
        }
    }

    isPersistent(guildId) {
        return this._persistentClients.hasOwnProperty(guildId);
    }

    startTimeout(guildId) {
        if (!this._leaveTimeouts.has(guildId)) {
            this._leaveTimeouts.set(guildId, setTimeout(() => {
                return;
            }, 5 * 60 * 1000));
        }
    }

    stopTimeout(guildId) {
        if (this._leaveTimeouts.has(guildId)) {
            clearTimeout(this._leaveTimeouts.get(guildId));
        }

        this._leaveTimeouts.delete(guildId);
    }
}

module.exports = new GuildsManager();