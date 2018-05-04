import React, {Component} from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import FontIcon from "material-ui/FontIcon";
import {BottomNavigation, BottomNavigationItem} from "material-ui/BottomNavigation";
import Paper from "material-ui/Paper";
import ActionHistory from "material-ui/svg-icons/action/history";
import ActionHome from "material-ui/svg-icons/action/home";
import ActionSettings from "material-ui/svg-icons/action/settings";
import PropTypes from "prop-types";
import {withStyles} from "material-ui/styles";
import RaisedButton from "material-ui/RaisedButton";
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import SettingsComponent from "./../Settings/Settings";
import HomeComponent from "./../Home/Home";
import HistoryComponent from "./../History/History";

import "./App.css";

const GLOBALPROXY = {
	URL: "localhost",
	WEBSOCKETPORT: "8888",
};

class MessageJson {
	constructor(messagetype, content) {
		this.messagetype = messagetype;
		this.content = content;
		this.secret = localStorage.getItem("alarmy-secret");
	}
	messagetype = "";
	content = "";
	secret = "";
}

const iconStyles = {
	marginRight: 24,
};

const bottomNav = {
	position: "fixed",
	bottom: 0,
	width: "100vw",
};

export default class App extends Component {
	connection = new WebSocket(`ws://${GLOBALPROXY.URL}:${GLOBALPROXY.WEBSOCKETPORT}`);
	state = {
		selectedIndex: 1,
	};
	constructor() {
		super();

		if (localStorage.getItem("alarmy-secret")) {
			this.connection.onmessage = this.handleMessage;
		} else {
			this.noSecretFound();
		}
	}

	select = index => this.setState({selectedIndex: index});

	noSecretFound() {}

	handleMessage(data) {
		let message = JSON.parse(data);
		switch (message.messagetype) {
			case "stuff":
			default:
		}
	}

	render() {
		return (
			<MuiThemeProvider>
				{this.state.selectedIndex == 0 ? (
					<HistoryComponent/>
				): this.state.selectedIndex == 1 ? (
					<HomeComponent/>
				): this.state.selectedIndex == 2 ? (
					<SettingsComponent/>
				):<p>Error</p>}
				<Paper zDepth={1} style={bottomNav}>
					<BottomNavigation className="bottomNav" selectedIndex={this.state.selectedIndex}>
						<BottomNavigationItem icon={<ActionHistory />} onClick={() => this.select(0)} />
						<BottomNavigationItem icon={<ActionHome />} onClick={() => this.select(1)} />
						<BottomNavigationItem icon={<ActionSettings />} onClick={() => this.select(2)} />
					</BottomNavigation>
				</Paper>
			</MuiThemeProvider>
		);
	}
}
