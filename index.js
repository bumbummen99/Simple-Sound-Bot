import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import Logger from 'c./ore/Logger.js';
import Bot from './Bot.js';

/* Load the configuration */
const envPath = args['--env'] ?? path.resolve(process.cwd() + '.env');
Logger.verbose('Bootstrap', 1, 'Loading .env from "' + envPath + '"...');
dotenv.config({
    path: envPath,
});

/* Configure AWS client */
AWS.config.region = process.env.AWS_REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.AWS_TOKEN,
});

/* Initialize the Bot */
const client = new Bot();

/* Login with the provided DISCORD_BOT_TOKEN */
client.login(process.env.DISCORD_BOT_TOKEN);