const http = require('http');

const hostname = '127.0.0.1';
const port = 1883;

var mqtt = require('mqtt');
var Sensor = require('./classes/sensor.js');
var client = mqtt.connect('mqtt://192.168.99.100:1883');

var sensorList = [];

//

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
});

client.on('connect',function(){
    console.log('Connected');
    client.subscribe('P2/Alarmy/+/+/Sensor/#');
    client.subscribe('P2/Alarmy/Client/#');
})

client.on('message',(topic, message) => {
    if(topic.toString().match('P2\/Alarmy\/[A-z0-9]+\/[A-z0-9]+\/Sensor\/.+')){
        handleSensorMessage(topic,message);
    }
    else if(topic.toString() === 'P2/Alarmy/Client/SensorStatus'){
        handleClientMessage(topic,message);
    }
})

function handleClientMessage(topic,message){
    
}


function handleSensorMessage(topic,message){
    var MSGObj = JSON.parse(message);
    console.log(MSGObj.content);
    if(MSGObj.content === 'activation'){
        var topArr = topic.split('/');
        var sensor = new Sensor(topArr[2],topArr[3],true,topArr[5]);
        sensorList.push(sensor);
    }
}


//TESTALARM
function alarmAlert(){
    
    client.publish('P2/Alarmy/255/Door/Actor/33',JSON.stringify({
        value: 'Alarm from Sensor',
        time: new Date().toTimeString()
    }));
    console.log('ALERT');

}


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

