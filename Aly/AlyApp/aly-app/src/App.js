import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { subscribe } from 'mqtt-react';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <body>
          <h1>Alarmy</h1>
          <Mqtt />
        </body>
      </div>
    );
  }
}

export default App

class Mqtt extends React.Component {
  render() {
    const mqtt = require('mqtt')

    const client = mqtt.connect('mqtt://172.18.251.90:1883')

    var connected = false
    var data = ""

    console.log("Mqtt")

    client.on('connect', () => {
      console.log("Connected")
      client.subscribe('P2/Alarmy/Client/#')
      client.publish('P2/Alarmy/Controller/SensorStatus', '{}')
    })

    console.log(connected)

    client.on('message', (topic, message) => {
      if(topic === 'P2/Alarmy/Client/SensorStatus') {
        connected = (message.toString() === 'true')
        data = message.toString()
      }
    })

    return (
      <p>{data}</p>
    )
  }
}
