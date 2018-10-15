FROM node:carbon

WORKDIR /opt/alarmy/controller

COPY . .

RUN npm install

# For mqtt
EXPOSE 1883
# For local secret swap
EXPOSE 3000
# For global proxy
EXPOSE 8082

CMD npm start
