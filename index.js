const dotenv = require('dotenv');
const arg = require('arg');
const path = require('path');
const { exit } = require('process');

const packageJSON = require('./package.json');
const Logger = require('./core/Logger.js');
const Bot = require('./Bot.js');
const AudioClient = require('./core/AudioClient.js');

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
Logger.verbose('Bootstrap', 1, 'Setting verbosity to ' + verbosity);
Logger.setVerboseness('Bootstrap', verbosity);
Logger.setVerboseness('Commands', verbosity);

/* Initialize the Bot */
Logger.verbose('Bootstrap', 1, 'Initializing the Bot...');
const client = new Bot();

/* Register stop listeners to shutdown gracefully */
const shutdown = () => {
    Logger.verbose('Bootstrap', 1, 'Received termination signal, shutting down gracefully...');

    AudioClient.getInstance().disconnect();
    client.destroy();

    Logger.verbose('Bootstrap', 1, 'Shutdown complete! Bye :)');
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

/* Login with the provided DISCORD_BOT_TOKEN */
client.login(process.env.DISCORD_BOT_TOKEN);