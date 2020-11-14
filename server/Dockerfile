FROM node:14

RUN mkdir -p /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /wait-for-it.sh

RUN yarn install
