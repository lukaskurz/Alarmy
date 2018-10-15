FROM node:carbon as builder

WORKDIR /tmp/alarmy/logger

COPY . .

RUN npm install &&\
	npm run-script build

FROM node:carbon

WORKDIR /usr/src/alarmy/logger

COPY --from=builder /tmp/alarmy/logger/build ./build/
COPY ./package.json ./
COPY ./config.json ./config.json


CMD npm start
