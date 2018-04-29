import * as mqtt from "mqtt";
import Rx, {Observer} from "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {MqttMessage} from "./mqttmessage";
import {IClientOptions} from "mqtt";

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
		this.Client = mqtt.connect(`mqtt://${config.Url}:${config.AccessPort}`).end();
		
		//Creates an cold observable for the messages being published
		this.Messages = Rx.Observable.create((observer: Observer<MqttMessage>) => {
			this.Client.on("message", (topic, message) => {
				observer.next(new MqttMessage(-100, new Date(), message.toString(), topic));
			});
		});

		//If the optional parameter is passed
		if (onMessage) {
			this.Messages.subscribe(onMessage);
		}
	}

	public Connect() {
		return new Promise((resolve, reject) => {
			const problemTimer = setTimeout(()=>reject("Couldn't establish connection after 30s"),30*1000);
			this.Client.on("connect", () => {
				if (this.Client.connected) {
					// Unsubscribes to prevent double subscriptions in case of reconnect
					this.Client.unsubscribe("#");
					//Captures all messages being published on any topic
					this.Client.subscribe("#");
					clearTimeout(problemTimer);
					resolve();
				} else {
					clearTimeout(problemTimer);
					reject("Couldn't connect to mqtt-broker");
				}
			});
			this.Client.reconnect();
		});
	}
}

export class MqttClientConfiguration {
	Url = "localhost";
	AccessPort = 1883;
	HttpPort = 8080;
}
