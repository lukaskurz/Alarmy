import React, {Component} from "react";
import "./App.css";

const GLOBALPROXY = {
	URL: "localhost",
	WEBSOCKETPORT: "8888",
};

class MessageJson {
	constructor(messageType, content){
		this.MessageType = messageType;
		this.Content = content;
	}
	MessageType = "";
	Content = "";
}

class App extends Component {
	connection = new WebSocket(`ws://${GLOBALPROXY.URL}:${GLOBALPROXY.WEBSOCKETPORT}`);
	constructor() {
		super();
		let message = new MessageJson("login",localStorage.getItem("alarmy-secret"));
		console.log(JSON.stringify(new MessageJson("login","superkurzespasswort")));
		if(message.Content == null){
			alert("You have not registered with your alarmy controller yet");
		} else {
			this.connection.onopen = () => {
				this.connection.send();
			};
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
