FROM node:carbon as builder
WORKDIR /tmp/alarmy/logger
COPY . .
RUN npm install &&\
	npm run-script build

FROM node:carbon
WORKDIR /usr/src/alarmy/logger
COPY --from=builder /tmp/alarmy/logger/out ./out/
COPY --from=builder /tmp/alarmy/logger/package*.json ./
RUN npm install --only=production
CMD npm start