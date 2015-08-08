#
# NodeJS environment for Higherframe web server
#

# Pull base image.
FROM node:latest

# Get around proxy
RUN git config --global url."https://".insteadOf git://

# Install Ruby and Compass
RUN \
  apt-get update && \
  apt-get install -y ruby ruby-dev libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++ && \
  gem update --system && \
  gem install compass bundler --no-ri --no-rdoc && \
  rm -rf /var/lib/apt/lists/*

# Copy git repo into docker container
COPY . /src

# Install Bower & Grunt
RUN npm install -g bower grunt-cli

# Install dependencies
RUN cd /src; npm install; bundle install; bower install --allow-root; grunt build:dist

# Expose the 8081 port
EXPOSE 8081

# Start the runtime
CMD ["node", "/src/dist/server/app.js"]
