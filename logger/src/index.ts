"use strict"

import * as mqtt from "mqtt";
import * as mysql from "mysql";

let client = mqtt.connect("mqtt://localhost:443");
client.subscribe("#");
client.on("message",(topic, message)=>{
    console.log(`${topic.toString()}: ${message.toString()}`);
});

let db = mysql.createConnection({
  host: "localhost",
  user: "nodelogger",
  password: "nodelogger.password"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database");
});