const dotenv = require('dotenv');
const arg = require('arg');
const path = require('path');
const { exit } = require('process');

const packageJSON = require('./package.json');
const Logger = require('./core/Services/Logger.js');
const Bot = require('./Bot.js');
const WikiPedia = require('./core/Utils/Wikipedia');
const GuildsManger = require('./core/AudioClient/GuildsManger');
const SpotifyWebAPI = require('./core/Services/SpotifyWebAPI');
const ServiceBooter = require('./core/ServiceBooter');

/* Wrap in async self executing anonymous arrow function so we can await */
(async () => {
    /* Retrieve CLI arguments */
    const args = arg({
        // Types
        '--help':    Boolean,
        '--version': Boolean,
        '--verbose': arg.COUNT,  // Counts the number of times --verbose is passed
        '--env':     String,      // --env <path>

        // Aliases
        '-h':        '--help',
        '-v':        '--verbose',
        '-e':        '--env'     // --env <path>
    });

    /* Show help if requested */
    if (args['--help']) {
        console.log('Simple Sound-Bot v' + packageJSON.version);
        console.log('--help       Shows the help dialog. Aliases: -h');
        console.log('--version    Shows the version of the worker.');
        console.log('--verbose    Sets the verbosity, use like -v or -vvvv. Aliases: -v');
        console.log('--env        Set the path to the .env file, fallback is CWD. Aliases: -e');
        exit(0);
    }

    /* Show version if requested */
    process.env.SOUND_BOT_VERSION = packageJSON.version;
    if (args['--version']) {
        console.log(packageJSON.version);
        exit(0);
    }

    /* Load the configuration */
    const envPath = args['--env'] ?? path.resolve(process.cwd() + '/.env');
    dotenv.config({
        path: envPath,
    });

    /* Boot the ServiceContainer */
    ServiceBooter();

    /* Configure Logger */
    const verbosity = args['--verbose'] ?? 0;
    Logger.getInstance().verbose('Bootstrap', 1, `Loaded .env from "${envPath}"...`);
    Logger.getInstance().setVerboseness('Bootstrap', verbosity).setModuleColor('Bootstrap', 'greenBright');
    Logger.getInstance().setVerboseness('Bot', verbosity).setModuleColor('Bot', 'greenBright');
    Logger.getInstance().setVerboseness('Commands', verbosity).setModuleColor('Commands', 'green');
    Logger.getInstance().setVerboseness('Player', verbosity).setModuleColor('Player', 'blue');
    Logger.getInstance().setVerboseness('AudioClient', verbosity).setModuleColor('AudioClient', 'blue');
    Logger.getInstance().setVerboseness('GuildsManager', verbosity).setModuleColor('GuildsManager', 'blue');
    Logger.getInstance().setVerboseness('YouTubeDL', verbosity).setModuleColor('YouTube', 'blue');
    Logger.getInstance().setVerboseness('TrackData', verbosity).setModuleColor('TrackData', 'grey');
    Logger.getInstance().verbose('Bootstrap', 1, 'Set verosity to "' + verbosity + '"');

    /* Configure Wikipedia */
    await WikiPedia.setLanguage(process.env.WIKIPEDIA_LANGUAGE ?? 'en');

    /* Configure Spotify */
    await SpotifyWebAPI.getInstance().auth();

    /* Initialize the Bot */
    Logger.getInstance().verbose('Bootstrap', 1, 'Initializing the Bot...');
    const client = new Bot();

    /* Register stop listeners to shutdown gracefully */
    const shutdown = () => {
        Logger.getInstance().verbose('Bootstrap', 1, 'Received termination signal, shutting down gracefully...');

        GuildsManger.destroy();
        client.destroy();

        Logger.getInstance().verbose('Bootstrap', 1, 'Shutdown complete! Bye :)');
        exit(0);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    Logger.getInstance().verbose('Bootstrap', 1, 'Starting the Bot...');

    /* Login with the provided DISCORD_BOT_TOKEN */
    client.login(process.env.DISCORD_BOT_TOKEN);
})();
