const { Command } = require('discord-akairo');

class Ping extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping']
        });
    }

    async exec(message) {
        const sent = await message.util.reply('Pong!');
        const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        return message.util.reply([
            'Pong',
            `🔂 **RTT**: ${timeDiff} ms`,
            `💟 **Heartbeat**: ${Math.round(this.client.ws.ping)} ms`
        ]);
    }
}

module.exports = Ping;