# Use latest LTS
FROM node:lts-alpine

# Install GIT so we can use git dependencies
RUN apk update && apk upgrade && apk add --no-cache bash git openssh

# Add the source
ADD . /root/simple-sound-bot/

# Set the workdir to the simple-sound-bot folder
WORKDIR /root/simple-sound-bot/

# Install dependencies (if not installed)
RUN npm install --no-dev

# Start the bot
CMD [ "sequelize", "db:migrate", "&&", "npm", "run", "start" ]