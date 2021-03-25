# Simple Sound-Bot
A simple sound bot for Discord to play music and read text using text to speech.

# Features
- [x] Simple YouTube-Audio player with queue and repeat
- [x] Text To Speech functionality using AWS Polly
- [x] Wikipedia integration, responds in text and using TTS.
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
npm run start -- --vvvv
```