import * as fs from "fs";
import { DatabaseClient, DatabaseClientConfiguration } from "./databaseclient";
import { MqttClient, MqttClientConfiguration } from "./mqttclient";

export class Logger {
	public MqttClient: MqttClient;
	public DatabaseClient: DatabaseClient;
	public constructor(private config: LoggerConfiguration = new LoggerConfiguration()) {
		this.DatabaseClient = new DatabaseClient(config.Database);
		this.MqttClient = new MqttClient(config.Mqtt);
		this.DatabaseClient.Connect().then(() => {
			this.MqttClient.Messages.subscribe(value => {
				console.log(value);
				this.DatabaseClient.Insert(value.Type, value.Timestamp, value.Topic, value.Content);
			}, error => {
				console.log(error);
			});
		});
	}
}

export class LoggerConfiguration {
	Mqtt = new MqttClientConfiguration();
	Database = new DatabaseClientConfiguration();
}
