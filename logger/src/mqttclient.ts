import * as mqtt from "mqtt";
import Rx, { Observer } from "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { MqttMessage } from "./mqttmessage";

export class MqttClient {
	public Messages: Observable<MqttMessage>;
	private Client: mqtt.MqttClient;

	public constructor(config: MqttClientConfiguration, onMessage?: (message: string) => void) {
		this.Client = mqtt.connect(`mqtt://${config.Url}:${config.AccessPort}`);
		console.log("Connected to mqtt-broker")
		this.Client.subscribe("#");

		this.Messages = Rx.Observable.create((observer: Observer<MqttMessage>) => {
			this.Client.on("message", (topic, message) => {
				observer.next(new MqttMessage(-100,new Date(),message.toString(), topic));
			});
		});
	}

}

export class MqttClientConfiguration {
	Url = "localhost";
	AccessPort = 1883;
	HttpPort = 8080;
}