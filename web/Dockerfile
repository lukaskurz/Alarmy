FROM node:carbon as build

WORKDIR /opt/alarmy

COPY ./ /opt/alarmy

RUN npm install &&\
    npm run build

FROM nginx:latest

WORKDIR /opt/alarmy

COPY --from=build /opt/alarmy/build /usr/share/nginx/html

EXPOSE 80