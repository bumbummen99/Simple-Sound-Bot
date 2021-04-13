# Simple Sound-Bot
Yes, another Discord music bot! But this one is supposed to be simple and to allow you to play music and text using text to speech. It also does have some extra functionality like reading Wikipedia articles.

# Features
- [x] Simple YouTube-Audio player with queue and repeat
- [x] Text To Speech functionality using AWS Polly
- [x] Wikipedia integration, responds in text and using TTS.
- [x] Greet people when they join the bots channel.
- [ ] More to come!

# Commands
Below you can find a description of all commands of the Bot.

## summon
Summons the Bot into your current voice channel.

## leave
Makes the Bot leave it's current voice channel.

## wiki
Respond with a Wikipedia article embed.

## tts
Reads the following text out loud in the currently connected voice channel.

## ttswiki
Reads the introduction of a Wikipedia article, good to force people to hear to useless information.

## play <YouTube-URL>
Plays the provided YouTube-URL. If no URL is provided it will try to resume the current playback.

## repeat
Enables the repeat mode that does repeat the current playback until being disabled again. To disable repeat just use the command again.

## queue <YouTube-URL>
Adds the provided YouTube-URL to the playback queue.

## skip
Skips the current playback, will play the next track in the queue (if there is one).

## volume
Sets the volume, use values like "0.5", "1", "50" or "100".

# Setup

## Docker
Simple-Spound-Bot provides an automatically generated docker image that you can easily use.

### Docker CLI
To use it with plain `docker` commands, simply install Docker for your operating system of choice and run the following command. Make sure to pass your environmenr variables!
```
docker run -v ~/.aws:/root/.aws -v ./cache:/root/simple-sound-bot/cache -e CMD_ARGUMENTS=-vvvv skyrpator/simple-sound-bot:latest
```
### Docker Compose
You can also use the provided compose file by using this command. This will automatically load the .env into the containers Environment.
```
export CMD_ARGUMENTS=-vvvv && docker-compose up
```

## Manual
Simply clone the repository locally. Next, copy the `.env.example` to `.env` and adjust the configuration to your needs. Alternatively you can also empty this file and pass those values to nodes environment directly.

Next simply run:
```
npm run start
```

If you want to pass arguments to the software, simply do like this:
```
npm run start -- --help
```

# Verbosity
The software will by default hide unecessary log outputs. To control the verbosity of the software, simply append the ´v´ argument. The amount of `v`'s controls the verbosity. For example, in order to set the verbosity to 4 the following command would have to be used:
```
npm run start -- -vvvv
```

# Thanks
- [Discord Akairo](https://github.com/discord-akairo/discord-akairo) - For the wonderful bot wrapper around discord.js.
- [SquadJS](https://github.com/Thomas-Smyth/SquadJS) - For the inspiration and basis for the Logger class.
- [Gabriel Tanner](https://gabrieltanner.org/) - For his great guide on creating discord music bots.

# Collaborators

<!-- readme: collaborators -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/bumbummen99">
            <img src="https://avatars.githubusercontent.com/u/4533331?v=4" width="100;" alt="bumbummen99"/>
            <br />
            <sub><b>Patrick</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: collaborators -end -->

# Contributors

<!-- readme: contributors -start -->
<table>
<tr>
    <td align="center">
        <a href="https://github.com/bumbummen99">
            <img src="https://avatars.githubusercontent.com/u/4533331?v=4" width="100;" alt="bumbummen99"/>
            <br />
            <sub><b>Patrick</b></sub>
        </a>
    </td></tr>
</table>
<!-- readme: contributors -end -->

# Support
If you like this project and you want to support me, you can do so below:

<p align="center">
    <a href="https://btcpay.sendcrypto.eu/api/v1/invoices?storeId=D7Ej1qPs95JsBtBqPQYcVFwRXqAuVqECu4QWsyNQGQSj&price=10&currency=EUR">
        <img alt="Pay with BTCPay" src="https://btcpay.sendcrypto.eu/img/paybutton/pay.svg">
    </a>
</p>