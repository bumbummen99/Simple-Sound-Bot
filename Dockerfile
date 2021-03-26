# Use latest LTS
FROM node:lts-alpine

# Add the source
ADD . /root/simple-sound-bot/

# Set the workdir to the simple-sound-bot folder
WORKDIR /root/simple-sound-bot/

# Install dependencies (if not installed)
RUN npm install --no-dev

# Start the bot
CMD [ "sequelize", "db:migrate", "&&", "npm", "run", "start" ]