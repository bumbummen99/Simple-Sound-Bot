const db = require('../../models/index.js');

class Queue {
    static async queue(guildId, clientId, path, name) {
        /* Create the model in the database */
        await db.Queue.create({
            guildId: guildId,
            clientId: clientId,
            path: path,
            name: name,
        });

        Logger.getInstance().verbose('AudioClient', 1, `Added URI "${path}" with name "${name}" to the Queue.`);
    }

    static async clearQueue(guildId) {
        /* Remove all items from queue */
        await db.Queue.destroy({
            where: {
                guildId: guildId,
            },
            truncate: true
        });

        Logger.getInstance().verbose('AudioClient', 1, `Cleared the whole Queue for guild ${guildId}.`);
    }

    static async queueSize(guildId) {
        return await db.Queue.count({
            where: {
                guildId: guildId,
            }
        });
    }

    static async nextInQueue(guildId) {
        return await db.Queue.findOne({
            where: {
                guildId: guildId,
            }
        });
    }

    static async removeEntry(id) {
        await db.Queue.destroy({
            where: {
                id: id,
            }
        });  

        Logger.getInstance().verbose('AudioClient', 1, 'Removed entry from Queue}.');
    }
}

module.exports = Queue;
