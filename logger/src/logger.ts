import * as mqtt from "mqtt";

import * as fs from "fs";
import {DatabaseClient, DatabaseClientConfiguration} from "./databaseclient";

export class Logger {
	public MqttClient: mqtt.MqttClient;
	public DatabaseClient: DatabaseClient;
	public constructor(private config: LoggerConfiguration = new LoggerConfiguration()) {
		this.MqttClient = mqtt.connect(`mqtt://${config.MqttUrl}:443`);
		this.MqttClient.subscribe("#");
		this.MqttClient.on("message", (topic, message) => {
			console.log(`${topic.toString()}: ${message.toString()}`);
		});

		this.DatabaseClient = new DatabaseClient(config.Database);
	}
}

export class LoggerConfiguration {
	MqttUrl = "localhost";
	MqttAccessPort = 1883;
	MqttHttpPort = 8080;
	Database = new DatabaseClientConfiguration();
}
