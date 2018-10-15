FROM node:carbon

WORKDIR /opt/alarmy/logger

COPY . .

RUN npm install &&\
	npm run-script build

# For database
EXPOSE 3306
# For mqtt
EXPOSE 1883

CMD npm start
