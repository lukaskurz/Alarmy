FROM node:carbon as build

WORKDIR /opt/alarmy/web

COPY . .

RUN npm install &&\
    npm run build

FROM nginx:latest

WORKDIR /opt/alarmy/web

COPY --from=build /opt/alarmy/web/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# RUN apt-get update && apt-get install openssl &&\
#     mkdir dh-param &&\
#     openssl dhparam -out ./dh-param/dhparam-4096.pem 4096

EXPOSE 80
EXPOSE 443