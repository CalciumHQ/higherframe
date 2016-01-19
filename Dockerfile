#
# # Pull base image.
# FROM node:5.4.1

# # Install dependencies
# RUN \
  # apt-get update && \
  # apt-get install -y ruby ruby-dev libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++ && \
  # gem install compass bundler --no-ri --no-rdoc

# # Install bower and grunt
# RUN npm install -g bower grunt-cli

# # Add application files
# COPY . /src

# # Install managed dependancies and build
# RUN cd /src && npm install && bundle install && bower install --allow-root && grunt build:dist

# # Expose the 8081 port
# EXPOSE 8081

# # Start the runtime
# CMD ["node", "/src/server/app.js"]


FROM ubuntu:12.04

RUN apt-get update
RUN apt-get install -y nginx zip curl

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN curl -o /usr/share/nginx/www/master.zip -L https://codeload.github.com/gabrielecirulli/2048/zip/master
RUN cd /usr/share/nginx/www/ && unzip master.zip && mv 2048-master/* . && rm -rf 2048-master master.zip

EXPOSE 80

CMD ["/usr/sbin/nginx", "-c", "/etc/nginx/nginx.conf"]
