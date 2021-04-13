const dotenv = require('dotenv');
const arg = require('arg');
const path = require('path');
const { exit } = require('process');

const packageJSON = require('./package.json');
const Logger = require('./core/Logger.js');
const Bot = require('./Bot.js');
const AudioClient = require('./core/AudioClient/AudioClient.js');
const WikiPedia = require('./core/Wikipedia');

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
    Logger.verbose('Bootstrap', 1, 'Loading .env from "' + envPath + '"...');
    dotenv.config({
        path: envPath,
    });

    /* Configure Logger */
    const verbosity = args['--verbose'] ?? 0;
    Logger.setVerboseness('Bootstrap', verbosity).setModuleColor('Bootstrap', 'greenBright');
    Logger.setVerboseness('Bot', verbosity).setModuleColor('Bot', 'grey');
    Logger.setVerboseness('Commands', verbosity).setModuleColor('Commands', 'green');
    Logger.setVerboseness('Player', verbosity).setModuleColor('Player', 'blue');
    Logger.setVerboseness('AudioClient', verbosity).setModuleColor('AudioClient', 'blue');
    Logger.setVerboseness('CommandHelper', verbosity).setModuleColor('CommandHelper', 'grey');
    Logger.setVerboseness('YouTube', verbosity).setModuleColor('YouTube', 'blue');
    Logger.verbose('Bootstrap', 1, 'Set verosity to "' + verbosity + '"');

    /* Configure Wikipedia */
    await WikiPedia.setLanguage(process.env.WIKIPEDIA_LANGUAGE ?? 'en');

    /* Initialize the Bot */
    Logger.verbose('Bootstrap', 1, 'Initializing the Bot...');
    const client = new Bot();

    /* Register stop listeners to shutdown gracefully */
    const shutdown = () => {
        Logger.verbose('Bootstrap', 1, 'Received termination signal, shutting down gracefully...');

        AudioClient.leave();
        client.destroy();

        Logger.verbose('Bootstrap', 1, 'Shutdown complete! Bye :)');
        exit(0);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    /* Login with the provided DISCORD_BOT_TOKEN */
    client.login(process.env.DISCORD_BOT_TOKEN);

    Logger.verbose('Bootstrap', 1, 'Bot successfully started!');
})();