const http = require('http');

const hostname = '127.0.0.1';
const port = 1883;

var mqtt = require('mqtt');
var client = mqtt.connect('localhost:1883');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
});

client.on('connect',function(){
    console.log('Connected');
    client.subscribe('P2/Alarmy/+/+/Sensor/#');
})

client.on('message',(topic, message) => {
    if(topic === 'P2/Alarmy/+/+/Sensor/#'){
        handleSensorMessage(topic,message)
    }
    client.end();
})

function handleSensorMessage(topic,message){
    var MSGObj = JSON.parse(message);
    alarmAlert();
}

function alarmAlert(){
    client.publish('P2/Alarmy/+/+/Actor/#',JSON.stringify({
        value: 'Alarm from Sensor',
        time: Date.now().toString()
    }));

}


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});