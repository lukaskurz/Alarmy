FROM java:8-jdk

RUN apt-get install -y wget unzip &&\
    wget --content-disposition http://www.hivemq.com/download.php?token=9468da1a04b017984af053ffc166dbf5 &&\
    unzip hivemq-*.zip -d /opt/ &&\
		rm hivemq-*.zip &&\
    mv /opt/hivemq-* /opt/hivemq

WORKDIR /opt/hivemq
 
ENV HIVEMQ_HOME /opt/hivemq

COPY config.xml /opt/hivemq/conf/config.xml
 
# Expose MQTT port
EXPOSE 1883
# Expse MQTT over Websocket port
EXPOSE 8000

CMD /opt/hivemq/bin/run.sh
