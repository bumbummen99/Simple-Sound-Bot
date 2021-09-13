# Use latest LTS
FROM node:lts-alpine

# Install GIT so we can use git dependencies
RUN apk update && apk upgrade && apk add --no-cache bash git openssh ffmpeg

# Add the source
ADD ../ /root/simple-sound-bot/

# Set the workdir to the simple-sound-bot folder
WORKDIR /root/simple-sound-bot/

# Install dependencies (if not installed)
RUN npm install

# Add YouTubeDL update to CRON
COPY /root/simple-sound-bot/installYouTubeDL.sh /etc/periodic/15min/installYouTubeDL

# Allow for overriding the CMD_ARGUMENTS
ENV CMD_ARGUMENTS ""

# Start the bot by first installing/updating YouTubeDL, migrating the Database and starting the bot
CMD [ "sh", "-c", "/root/simple-sound-bot/installYouTubeDL.sh && npx sequelize db:migrate && npm run start -- ${CMD_ARGUMENTS}" ]
