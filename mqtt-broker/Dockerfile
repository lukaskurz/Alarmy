#
# HiveMQ Dockerfile
#
 
# Pull base image. The official docker openjdk-8 image is used here.
FROM java:8-jdk
 
#Install wget and unzip, then download and install HiveMQ.
RUN \
    apt-get install -y wget unzip &&\
    wget --content-disposition http://www.hivemq.com/download.php?token=9468da1a04b017984af053ffc166dbf5 &&\
    unzip hivemq-*.zip -d /opt/ &&\
    mv /opt/hivemq-* /opt/hivemq
  
# Define working directory.
WORKDIR /opt/hivemq
 
# Define HIVEMQ_HOME variable
ENV HIVEMQ_HOME /opt/hivemq
 
# Expose MQTT port
EXPOSE 1883
 
# Define default command. Here we use HiveMQ's run script.
CMD ["/opt/hivemq/bin/run.sh"]
