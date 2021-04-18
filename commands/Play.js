const PlayerCommand = require('../core/Commands/PlayerCommand.js');
const Logger = require('../core/Services/Logger.js');
const Queue = require('../core/Player/Queue.js');

class PlayCommand extends PlayerCommand {
    constructor() {
        super('play', {
            aliases: ['play'],
            args: [
                {
                    id: 'input',
                    type: 'string',
                    default: '',
                    match: 'rest',
                },
            ],
            quoted: false,
            channel: 'guild',
        });
    }

    async childExec(message, args) {
        Logger.getInstance().verbose('Commands', 1, `[Play] Play command received. Input: "${args.input}"`);

        const audioClient = this.getAudioClientForGuild(message.guild.id);

        /* If no URL has been supplied we have to check if the AudioClient is paused and can be resumed */
        if (!args.input.length) {
            Logger.getInstance().verbose('Commands', 1, '[Play] No input provided, trying to resume playback or play next in queue.');
            if (audioClient.isPaused()) {
                audioClient.resume();

                return message.util.reply('Trying to resume current playback...');
            } else if (await Queue.queueSize(message.guild.id)) {
                return Promise.all([
                    message.util.reply('Trying to play next in queue...'),
                    await audioClient.next(),
                ]);
            } else {
                return message.util.reply('There is nothing to resume or play, please provide an input.');
            }
        } else {
            /* Try to extract the videoID from the URL */
            const trackData = await this.getTrackData(args.input);

            /* Verify that we have the videoID and thereby a valid YouTube URL */
            if (!trackData) {
                Logger.getInstance().verbose('Commands', 1, `[Play] No results found for: "${args.input}"`, 'yellow');
                return message.util.reply(`No results found for: "${args.input}"`);
            }

            Logger.getInstance().verbose('Commands', 1, `[Play] Trying to play "${trackData.getName()}" from path "${trackData.getPath()}"`);
            audioClient.play(trackData.getPath());

            return message.util.reply(trackData.getEmbed());
        }
    }
}

module.exports = PlayCommand;