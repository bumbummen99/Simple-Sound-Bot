#!/usr/bin/env bash

TMP_DIR=mktmp

# Download latest version using curl or wget if curl is not available
if [ which curl ]; then
  curl -L https://yt-dl.org/downloads/latest/youtube-dl -o $TMP_DIR/youtube-dl
else
  wget https://yt-dl.org/downloads/latest/youtube-dl -O $TMP_DIR/youtube-dl
fi

# Check if youtube-dl has changed and update it if it did
if [ ! -f /usr/local/bin/youtube-dl ] || [ ! cmp --silent /usr/local/bin/youtube-dl $TMP_DIR/youtube-dl ]; then
  chmod a+rx $TMP_DIR/youtube-dl
  mv $TMP_DIR/youtube-dl /usr/local/bin/youtube-dl
fi

# Show the installed version
youtube-dl --version
