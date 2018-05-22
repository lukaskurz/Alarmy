const http = require("http");

const hostname = "127.0.0.1";
const port = 1883;

var mqtt = require("mqtt");
var webSocketClient = require("websocket").client;
var Sensor = require("./classes/sensor.js");
var client = mqtt.connect("mqtt://127.0.0.1:1883");

var sensorList = [];

var websocketClient = new webSocketClient();

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/plain");
});

websocketClient.on("connectFailed", function(error) {
	console.log("Connection error: " + error.toString());
});

websocketClient.on("connect", function(connection) {
	console.log("Websocket Client Connected");
	connection.on("error", function(error) {
		console.log("Connection error " + connection.toString());
	});

	connection.on("close", function() {
		console.log("Websocket Connection closed");
	});

	connection.on("message", function(message) {});
});

websocketClient.connect("ws://localhost:8080/", "echo-protocol");

client.on("connect", function() {
	console.log("Connected");
	client.subscribe("p2/alarmy/+/+/sensor/#");
	client.subscribe("p2/alarmy/client/#");
	client.subscribe("p2/alarmy/controller/#");
});

client.on("message", (topic, message) => {
	console.log(`${topic}: ${message}`);
	if (topic.toString().match("p2/alarmy/[A-z0-9]+/[A-z0-9]+/sensor/.+")) {
		handleSensorMessage(topic, message);
	} else if (topic.toString().match("p2/alarmy/controller/.+")) {
		handleClientMessage(topic, message);
	}
});

function handleClientMessage(topic, message) {
	console.log(topic.toString().toLocaleLowerCase());
	if (topic.toString().toLocaleLowerCase() === "p2/alarmy/controller/sensorstatus".toLocaleLowerCase()) {
		var jsObj = JSON.parse(
			'{ "type":300, "timestamp": "' + new Date().toDateString() + " " + new Date().toTimeString() + '", "content": []}'
		);

		sensorList.forEach(function(element) {
			jsObj.content.push(JSON.stringify(element));
			console.log(element);
		});
		client.publish("p2/alarmy/client/sensorstatus", JSON.stringify(jsObj));
	}
}

function handleSensorMessage(topic, message) {
	var MSGObj = JSON.parse(message);
	var topArr = topic.split("/");
	var sensor = new Sensor(topArr[2], topArr[3], true, topArr[5]);
	if (MSGObj.content === "activation") {
		if (!isSensorActivated(sensor)) {
			sensorList.push(sensor);
		}
	} else if (MSGObj.content === "alert") {
		if (isSensorActivated(sensor)) {
			var jsObj = {
				type: 100,
				timestamp: new Date(),
				content: `${sensor.room}/${sensor.position}/${sensor.type}`
			}
			console.log(jsObj);
			client.publish("p2/alarmy/", JSON.stringify(jsObj));
		}
	}
}

function isSensorActivated(sensor) {
	var found = false;
	sensorList.forEach(function(element) {
		if (sensor.room === element.room && sensor.position === element.position && sensor.type === element.type) {
			found = true;
		}
	});
	return found;
}

//TESTALARM
function alarmAlert() {
	client.publish(
		"p2/alarmy/255/door/actor/33",
		JSON.stringify({
			value: "Alarm from Sensor",
			time: new Date().toTimeString(),
		})
	);
	console.log("ALERT");
}

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
