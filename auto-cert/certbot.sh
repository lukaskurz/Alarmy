sudo docker run -it --rm \
-v /docker-volumes/etc/letsencrypt:/etc/letsencrypt \
-v /docker-volumes/var/lib/letsencrypt:/var/lib/letsencrypt \
-v /docker/letsencrypt-docker-nginx/src/letsencrypt/letsencrypt-site:/data/letsencrypt \
-v "/docker-volumes/var/log/letsencrypt:/var/log/letsencrypt" \
certbot/certbot \
certonly --webroot \
--renew-by-default \
--email lukaskurz5@gmail.com --text --agree-tos --no-eff-email \
--webroot-path=/data/letsencrypt \
--staging \
-d shorty.codes -d www.shorty.codes