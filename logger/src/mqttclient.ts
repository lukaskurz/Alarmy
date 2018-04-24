import * as mqtt from "mqtt";
import Rx, { Observer } from "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { MqttMessage } from "./mqttmessage";

export class MqttClient {
	public Messages: Observable<MqttMessage>;
	private Client: mqtt.MqttClient;

	/**
	 * Connects to the mqtt-broker and subscribes using the "#" wildcard to capture all messages being published.
	 * Creates a cold observable for the messages beeing captured.
	 * @param config Configuration containing Url and ports
	 * @param onMessage Function that subscribes to the cold observable, making it a hot observable. If left empty, the observable stays cold
	 */
	public constructor(config: MqttClientConfiguration, onMessage?: (message: MqttMessage) => void) {
		//Connects to the mqtt-broker
		this.Client = mqtt.connect(`mqtt://${config.Url}:${config.AccessPort}`);
		//Captures all messages being published on any topic
		this.Client.subscribe("#");

		//Creates an cold observable for the messages being published
		this.Messages = Rx.Observable.create((observer: Observer<MqttMessage>) => {
			this.Client.on("message", (topic, message) => {
				observer.next(new MqttMessage(-100,new Date(),message.toString(), topic));
			});
		});

		//If the optional parameter is passed
		if(onMessage){
			this.Messages.subscribe(onMessage);
		}
	}

}

export class MqttClientConfiguration {
	Url = "localhost";
	AccessPort = 1883;
	HttpPort = 8080;
}