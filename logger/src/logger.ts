import * as fs from "fs";
import { DatabaseClient, DatabaseClientConfiguration } from "./databaseclient";
import { MqttClient, MqttClientConfiguration } from "./mqttclient";

/**
 * Logs all the information sent over a mqtt-broker and writes it to a mysql database
 */
export class Logger {
	private MqttClient: MqttClient;
	private DatabaseClient: DatabaseClient;

	/**
	 * Initiates the Database- and MqttClient. First connects to the database.
	 * After successfully connecting to the database, it connects to the mqtt-broker and starts logging
	 * @param config Configuration containing url, ports and passwords needed
	 */
	public constructor(private config: LoggerConfiguration = new LoggerConfiguration()) {
		console.log("Initiating database client...")
		this.DatabaseClient = new DatabaseClient(config.Database);
		console.log("Initiating mqtt client...")
		this.MqttClient = new MqttClient(config.Mqtt);

		//Connects to database
		this.DatabaseClient.Connect().then(() => {
			console.log("Finished connecting to database");

			//After connecting, subscribe the db writing process to the mqtt-broker
			this.MqttClient.Messages.subscribe(value => {
				//Write the logged value to the db
				this.DatabaseClient.Insert(value.Type, value.Timestamp, value.Topic, value.Content).catch(err =>{
					//Log error receiveded when trying to write to db
					console.error(err);
				});
			}, error => {
				//Log error received when listening to mqtt-broker
				console.error(error);
			});

			console.log("Started capturing mqtt messages");
		});
	}


}

export class LoggerConfiguration {
	Mqtt = new MqttClientConfiguration();
	Database = new DatabaseClientConfiguration();
}
