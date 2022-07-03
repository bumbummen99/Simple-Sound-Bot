const { Listener } = require('@skyraptor/discord-akairo');

class VoiceStateUpdateListener extends Listener {
    constructor() {
        super('messageInvalid', {
            emitter: 'commandHandler',
            event: 'messageInvalid'
        });
    }

    exec(message) {
        //if (this.startsWithPrefixes(message.content)) {
        //    message.util.reply('Sorry, that is not valid command.');
        //}
    }

    startsWithPrefixes(input) {
        for (const prefix of this.getPrefixes()) {
            if (input.startsWith(prefix)) {
                return true;
            }
        }

        return false;
    }

    getPrefixes() {
        let prefixes = process.env.DISCORD_BOT_COMMAND_PREFIX;

        if (this.isFunction(prefixes)) {
            prefixes = prefixes();
        }

        if (!Array.isArray(prefixes)) {
            prefixes = [prefixes];
        }

        return prefixes;
    }

    isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
}

module.exports = VoiceStateUpdateListener;
