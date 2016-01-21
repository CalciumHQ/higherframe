
# Pull base image.
FROM node:5.4.1

# Install dependencies
RUN \
  apt-get update && \
  apt-get install -y ruby ruby-dev libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++ && \
  gem install compass bundler --no-ri --no-rdoc

# Add application files
COPY . /src

# Install managed dependancies and build
# Some node dependancies need to be recompiled with image libraries available,
# so we do this here rather than copied in from outside the container
RUN cd /src && npm install --production && bundle install

# Expose the 8081 port
EXPOSE 8081

# Start the runtime
CMD ["node", "/src/server/app.js"]
