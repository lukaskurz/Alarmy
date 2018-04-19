"use strict"

import * as mqtt from "mqtt";

let client = mqtt.connect("mqtt://localhost:443");
client.subscribe("#");
client.on("message",(topic, message)=>{
    console.log(`${topic.toString()}: ${message.toString()}`);
})
