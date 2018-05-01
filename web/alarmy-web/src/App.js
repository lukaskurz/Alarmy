import React, {Component} from "react";
import "./App.css";

const GLOBALPROXY = {
	URL: "localhost",
	WEBSOCKETPORT: "8888",
};

class MessageJson {
	constructor(messagetype, content){
		this.messagetype = messagetype;
		this.content = content;
		this.secret = localStorage.getItem("alarmy-secret");
	}
	messagetype = "";
	content = "";
	secret = "";
}

class App extends Component {
	connection = new WebSocket(`ws://${GLOBALPROXY.URL}:${GLOBALPROXY.WEBSOCKETPORT}`);
	constructor() {
		super();
		if(localStorage.getItem("alarmy-secret")){
			this.connection.onmessage = this.handleMessage;
		} else {
			this.noSecretFound();
		}
	}

	noSecretFound(){

	}

	handleMessage(data){
		let message = JSON.parse(data);
		switch(message.messagetype){
			case "stuff":
			default:
		}
	}

	render() {
		return (
		<div>
			<button onClick={()=>alert("WOOP WOOP. THATS DA SOUND OF DA POLICE")}>Activate</button>	
		</div>);
	}
}

export default App;
