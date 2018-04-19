docker run \
	--name log-db \
	-e MYSQL_ROOT_PASSWORD=Rh1NMO8AfmWaDiM0QnS6dyKZClA5YxNp \
	-e MYSQL_DATABASE=alarmy \
	-p 3306:3306 \
	-d \
	mysql:8.0.4
