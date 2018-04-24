# Alarmy

Alarmy is an alarm system based on MQTT.

Secure your home now!

# Setup

Start the broker using docker. First build the image with `docker build -t mqtt-broker .` and then
run it with `docker run -p 1883:1883 -p 8080:8080 mqtt-broker:latest`.
If you want to close the terminal after executing, add the `-p` paramater to the run command.
