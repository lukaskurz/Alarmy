const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://vm61.htl-leonding.ac.at:1883');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

client.on('connect',function(){
    console.log('Connected');
    client.subscribe('P2/Actors/#');
    client.subscribe('P2/Sensors/#');
    client.publish('P2/Sensors/E315','LightSensorAlert');
})

client.on('message',(topic, message) => {
    if(topic === 'P2/Sensors/E315'){
        console.log(message.toString());
    }
    client.end();
})



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});