//---------------------------------
//------- ALARMY CONTROLLER -------
//Harwöck Florian, Kurz Lukas, Leeb Andreas, Leitenbauer Markus


const http = require("http");

const hostname = "127.0.0.1";
var randExp = require("randexp");
const port = 1883;
const fs = require("fs");

var mqtt = require("mqtt");
var webSocketClient = require("websocket").client;
var Sensor = require("./classes/sensor.js");
var client = mqtt.connect("mqtt://127.0.0.1:1883");

var sensorList = [];

//Global proxy secret file + random generated secret if no one exists
const secretFilename = "secret.txt";
var secret = new randExp("[a-zA-Z0-9]{32}^").gen();
if (fs.existsSync(secretFilename)) {
	secret = fs.readFileSync(secretFilename).toString();
} else {
	fs.writeFileSync(secretFilename, secret);
}

var websocketClient = new webSocketClient();


//http connection for secret inspection
const server = http
	.createServer((req, res) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/plain");
		res.setHeader("Access-Control-Allow-Origin","*")
		res.setHeader("Access-Control-Allow-Headers","X-Requested-With")
	})
	.listen(3000);

//Http endpoint for the local secret swap with the app
server.on("request", (req, res) => {
	if (req.method == "GET") {
		var msg = {
			secret: secret,
		};
		res.write(JSON.stringify(msg));
		res.end();
	}
});

//websocket error logging
websocketClient.on("connectFailed", function(error) {
	console.log("Websocket connection error: " + error.toString());
});

//Websocket message handling for the websocket connection
websocketClient.on("connect", function(connection) {
	console.log("Websocket client Connected");
	connection.on("error", function(error) {
		console.log("Connection error " + connection.toString());
	});

	connection.on("close", function() {
		console.log("Websocket Connection closed");
	});

	connection.on("message", function(message) {
		console.log("ws received:"+message.utf8Data);
		message = JSON.parse(message.utf8Data);
		switch(message.messagetype){
			case "sensorStatus":
				connection.send(JSON.stringify(getSensorsAsJSON()));
				break;
			case "systemEnabled":
				if(message.content === true){
					console.log("Alarm is now actived");
				} else {
					console.log("Alarm is now deactivated");
				}
		}
	});
});


//connection to the global proxy
websocketClient.connect("ws://globproxy.htl.harwoeck.at:8082/controller/" + secret);


//mqtt subscription on sensor, client and controller topics
client.on("connect", function() {
	console.log("Mqtt connected");
	client.subscribe("p2/alarmy/+/+/sensor/#");
	client.subscribe("p2/alarmy/client/#");
	client.subscribe("p2/alarmy/controller/#");
});


//Decision whether there comes an mqtt message from a sensor or a client
client.on("message", (topic, message) => {
	console.log(`${topic}: ${message}`);

	if (topic.toString().match("p2/alarmy/[A-z0-9]+/[A-z0-9]+/sensor/.+")) {
		handleSensorMessage(topic, message);
	} else if (topic.toString().match("p2/alarmy/controller/.+")) {
		handleClientMessage(topic, message);
	}
});


//handling different client messages
function handleClientMessage(topic, message) {
	console.log(topic.toString().toLocaleLowerCase());
	if (topic.toString().toLocaleLowerCase() === "p2/alarmy/controller/sensorstatus".toLocaleLowerCase()) {
		client.publish("p2/alarmy/client/sensorstatus", JSON.stringify(getSensorsAsJSON()));
	}
}

//get the full ist of all sensors and prepare it as a json string with an 
//array of JSON objcts packed in the content field
function getSensorsAsJSON(){
	var jsObj = JSON.parse(
		'{ "type":300, "timestamp": "' + new Date().toDateString() + " " + new Date().toTimeString() + '", "content": []}'
	);

	sensorList.forEach(function(element) {
		jsObj.content.push(JSON.stringify(element));
		console.log(element);
	});
	return jsObj;
}


//handling the different types of sensor messages
//activation -- sensor communicates with the controller for the firs time
//alert -- sensor gets activated and sends an emergency alert to the controller
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
				content: `${sensor.room}/${sensor.position}/${sensor.type}`,
			};
			console.log(jsObj);
			client.publish("p2/alarmy/", JSON.stringify(jsObj));
		}
	}
}


//checks if a sensor is already inserted and activated in the sensor list
function isSensorActivated(sensor) {
	var found = false;
	sensorList.forEach(function(element) {
		if (sensor.room === element.room && sensor.position === element.position && sensor.type === element.type) {
			found = true;
		}
	});
	return found;
}
