docker run \
	-e MYSQL_ROOT_PASSWORD=Rh1NMO8AfmWaDiM0QnS6dyKZClA5YxNp \
	-e MYSQL_DATABASE=alarmy \
	-e MYSQL_USER=nodelogger \
	-e MYSQL_PASSWORD=nodelogger.password \
	--net=host \
	-t \
	mysql:5.5
