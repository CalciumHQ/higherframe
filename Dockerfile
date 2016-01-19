
# Pull base image.
FROM node:5.4.1

# Install dependencies
RUN \
  apt-get update && \
  apt-get install -y ruby ruby-dev libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++ && \
  gem install compass bundler --no-ri --no-rdoc

# Install bower and grunt
RUN npm install -g bower grunt-cli

# Add application files
COPY . /src

# Install managed dependancies and build
RUN cd /src && npm install && bundle install && bower install --allow-root && grunt build:dist

# Expose the 8081 port
EXPOSE 8081

# Start the runtime
CMD ["node", "/src/server/app.js"]
