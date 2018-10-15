import React, {Component} from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {BottomNavigation, BottomNavigationItem} from "material-ui/BottomNavigation";
import Paper from "material-ui/Paper";
import ActionHistory from "material-ui/svg-icons/action/history";
import ActionHome from "material-ui/svg-icons/action/home";
import ActionSettings from "material-ui/svg-icons/action/settings";

import SettingsComponent from "./../Settings/Settings";
import HomeComponent from "./../Home/Home";
import HistoryComponent from "./../History/History";
import MessageJson from "./../MessageJson";
import AlarmComponent from "./../Alarm/Alarm";

import "./App.css";

const GLOBALPROXY = {
	URL: "alarmy.shorty.codes",
	WEBSOCKETPORT: "8082",
};

export default class App extends Component {
	state = {
		selectedIndex: 1,
		registered: false,
		systemEnabled: localStorage.getItem("alarmy-status") === "true", // cache the status
		systemAddress: "127.0.0.1",
		sensors: [],
		alarmHistory: [],
		alarmTriggered: false
	};

	websocket;

	styles = {
		bottomNav: {
			position: "fixed",
			bottom: 0,
			width: "100vw",
		},
		iconStyles: {
			marginRight: 24,
		},
	};

	constructor() {
		super();

		this.onRegisterChange = this.onRegisterChange.bind(this);
		this.onSystemAddressChange = this.onSystemAddressChange.bind(this);
		this.onSystemEnabledChange = this.onSystemEnabledChange.bind(this);
		this.handleWebsocketMessage = this.handleWebsocketMessage.bind(this);
		this.onAlarmTriggeredChange = this.onAlarmTriggeredChange.bind(this);

		if (localStorage.getItem("alarmy-secret")) {
			this.state.registered = true;
			this.connectWebsocket();
		}
	}

	onAlarmTriggeredChange(acknowledged){
		if(acknowledged === true){
			this.setState({alarmTriggered: false});
			this.onSystemEnabledChange(false); //Turn off system
		} else {
			this.setState({alarmTriggered: false});
		}
	}

	onSystemAddressChange(address) {
		this.setState({systemAddress: address});
	}

	onRegisterChange(registered) {
		this.setState({registered: registered});
		if (registered === true) {
			this.connectWebsocket();
		}
	}

	onSystemEnabledChange(locked) {
		this.setState({systemEnabled: locked});
		let msg = new MessageJson(100,locked);
		this.sendWebsocketMessage(msg);
		localStorage.setItem("alarmy-status",locked);
	}

	connectWebsocket() {
		this.websocket = new WebSocket(`ws://${GLOBALPROXY.URL}:${GLOBALPROXY.WEBSOCKETPORT}/client/${localStorage.getItem("alarmy-secret")}`);

		this.websocket.onopen = event => {
			console.log(`connected to the global proxy: ${event}`);
			this.sendWebsocketMessage(new MessageJson(300,"")); 	// Get Sensors
			this.sendWebsocketMessage(new MessageJson(101,""));	// Get alarmstatus
			this.sendWebsocketMessage(new MessageJson(401,""));	// Get history
		};
		this.websocket.onerror = event => {
			console.log(`error with the global proxy: ${event}`);
		};
		this.websocket.onclose = event => {
			console.log(`global prox connection closed: ${event.reason}`);
		};
		this.websocket.onmessage = this.handleWebsocketMessage;
	}

	handleWebsocketMessage(data) {
		console.log(`Received global proxy message:`);
		console.log(data);

		const msg = JSON.parse(data.data);
		switch(msg.type){
			case 400:
				this.setState({alarmHistory: msg.content});
				console.log(msg.content.data);
				break;
			case 300:
				this.setState({sensors: msg.content})
				break;
			case 200:
				this.setState({alarmTriggered: true});
				break;
			case 100:	//Sets alarm active/inactive
				//Turn off alarm
				if(msg.content === false){
					this.setState({systemEnabled: msg.content, alarmTriggered: false})
				} else {
					this.setState({systemEnabled: msg.content})
				}
				localStorage.setItem("alarmy-status",msg.content);
				break;
		}
	}

	sendWebsocketMessage(obj){
		const msg = JSON.stringify(obj);
		this.websocket.send(msg);
		console.log("sent "+msg);
	}

	select = index => this.setState({selectedIndex: index});

	render() {
		return (
			<MuiThemeProvider>
				<div>
					{this.state.selectedIndex === 0 ? (
						<HistoryComponent history={this.state.alarmHistory}/>
					) : this.state.selectedIndex === 1 ? (
						<HomeComponent
							registered={this.state.registered}
							systemEnabled={this.state.systemEnabled}
							onSystemEnabledChange={this.onSystemEnabledChange}
							sensors={this.state.sensors}
						/>
					) : this.state.selectedIndex === 2 ? (
						<SettingsComponent
							systemAddress={this.state.systemAddress}
							onSystemAddressChange={this.onSystemAddressChange}
							onRegisterChange={this.onRegisterChange}
						/>
					) : (
						<p>Error</p>
					)}
					<Paper zDepth={1} style={this.styles.bottomNav}>
						<BottomNavigation className="bottomNav" selectedIndex={this.state.selectedIndex}>
							<BottomNavigationItem icon={<ActionHistory />} onClick={() => this.select(0)} />
							<BottomNavigationItem icon={<ActionHome />} onClick={() => this.select(1)} />
							<BottomNavigationItem icon={<ActionSettings />} onClick={() => this.select(2)} />
						</BottomNavigation>
					</Paper>
				</div>
				{this.state.alarmTriggered === true?<AlarmComponent onAlarmTriggeredChange={this.onAlarmTriggeredChange}/>:""}
			</MuiThemeProvider>
		);
	}
}
