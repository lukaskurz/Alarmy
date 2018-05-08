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
    client.subscribe('P2/Alarmy/Controller/#');
})

client.on('message',(topic, message) => {
    console.log(topic + message);
    if(topic.toString().match('P2\/Alarmy\/[A-z0-9]+\/[A-z0-9]+\/Sensor\/.+')){
        handleSensorMessage(topic,message);
    }
    else if(topic.toString().match('P2\/Alarmy\/Controller\/.+')){
        handleClientMessage(topic,message);
    }
})

function handleClientMessage(topic,message){
    console.log(topic.toString().toLocaleLowerCase());
    if(topic.toString().toLocaleLowerCase() === 'P2/Alarmy/Controller/SensorStatus'.toLocaleLowerCase()){
        var jsObj=JSON.parse('{ "type":300, "timestamp": "'+new Date().toDateString() + ' ' +new Date().toTimeString() +
                    '", "content": []}');

        sensorList.forEach(function(element){
            jsObj.content.push(JSON.stringify(element));
            console.log(element);
        });
        client.publish('P2/Alarmy/Client/SensorStatus',JSON.stringify(jsObj));
    }
}


function handleSensorMessage(topic,message){
    var MSGObj = JSON.parse(message);
    var topArr = topic.split('/');
    var sensor = new Sensor(topArr[2],topArr[3],true,topArr[5]);
    if(MSGObj.content === 'activation'){
        if(!isSensorActivated(sensor)){
            sensorList.push(sensor);
        }
    }
    else if(MSGOBJ.content === 'alert'){
       if(isSensorActivated(sensor)){
           var jsObj=JSON.parse('{ "type":300, "timestamp": "'+new Date().toDateString() + ' ' +new Date().toTimeString() +
           '", "content": Alert by }'+sensor.romm+'/'+sensor.position+'/'+sensor.type)
           console.log(jsObj);
           client.publish('P2/Alarmy/+/+/Actor/#',JSON.stringify(jsObj));
       }
    }
}

function isSensorActivated(sensor){
    var found = false;
    sensorList.forEach(function(element){
        if(sensor.room === element.room && sensor.position === element.position && sensor.type === element.type){
            found = true;
        }
    });
    return found;
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

