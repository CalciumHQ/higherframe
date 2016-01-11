# FROM heroku/nodejs

# Inherit from Heroku's stack
FROM heroku/cedar:14

# Internally, we arbitrarily use port 3000
ENV PORT 3000
# Which version of node?
ENV NODE_ENGINE 5.4.0
# Locate our binaries
ENV PATH /app/heroku/node/bin/:/app/user/node_modules/.bin:$PATH

# Create some needed directories
RUN mkdir -p /app/heroku/node /app/.profile.d
WORKDIR /app/user

# Install node
RUN curl -s https://s3pository.heroku.com/node/v$NODE_ENGINE/node-v$NODE_ENGINE-linux-x64.tar.gz | tar --strip-components=1 -xz -C /app/heroku/node

# Export the node path in .profile.d
RUN echo "export PATH=\"/app/heroku/node/bin:/app/user/node_modules/.bin:\$PATH\"" > /app/.profile.d/nodejs.sh

# Install dependencies
RUN \
  apt-get update && \
  apt-get install -y ruby ruby-dev libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++ && \
  gem install compass bundler --no-ri --no-rdoc

# Install bower and grunt
RUN npm install -g bower grunt-cli

# Add application files
ADD . /app/user/

# Install managed dependancies
RUN npm install
RUN bundle install
RUN bower install  --allow-root
RUN grunt build:dist
