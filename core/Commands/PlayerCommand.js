const AbstractCommand = require("./AbstractCommand");
const GuildsManager = require("../AudioClient/GuildsManger");
const TrackData = require("../Player/TrackData");
const Spotify = require("../Utils/YouTubeDL/Spotify");
const YouTube = require("../Utils/YouTubeDL/YouTube");

class PlayerCommand extends AbstractCommand {
    getAudioClientForGuild(guildId) {
        return GuildsManager.get(guildId);
    }

    async getTrackData(input) {
        /* Remove <> wrapper if exists */
        if (input.startsWith('<') && input.endsWith('>')) {
            input = input.slice(1, -1);
        }

        /* Not an URL, try to search YouTube */
        if (!input.startsWith('http')) {
            input = await YouTube.search(input);
        }

        /* We have an URL, check what service is being requested */

        /* Check if is YouTube URL */
        if (YouTube.getIdFromURL(input)) {
            const video = await YouTube.download(input);
            return new TrackData('youtube', YouTube.getCachePath(YouTube.getIdFromURL(input)), `https://www.youtube.com/watch?v=${video.videoId}`, video.name, video.description, video.thumbnail);
        }
        
        //else if (Spotify.getIdFromURL(input)) {
        //    const track = await Spotify.download(input);
        //    return new TrackData('spotify', YouTube.getCachePath(YouTube.getIdFromURL(input)), `https://open.spotify.com/track/${track.trackId}`, track.name, null, track.thumbnail);
        //}

        /* Check if URL is SoundCloud */
        //TODO    

        return null;
    }

    childExec(message, args) {
        throw new Error('Not implemented!');
    }
}

module.exports = PlayerCommand;
