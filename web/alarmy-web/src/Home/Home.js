import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import ActionLockOpen from "material-ui/svg-icons/action/lock-open";
import ActionLockOutline from "material-ui/svg-icons/action/lock-outline";

export default class HomeComponent extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		registered: localStorage.getItem("alarmy-secret") ? true : false,
		systemEnabled: false,
	};

	styles = {
		AppBar: {
			IconLeft: {
				display: "none",
			},
		},
		Card: {
			margin: "10px",
		},
	};

	render() {
		return (
			<div>
				<AppBar iconStyleLeft={this.styles.AppBar.IconLeft} title={<span>Home</span>} />
				{this.state.registered == true ? this.renderRegistered() : <p>Not Registered</p>}
			</div>
		);
	}

	renderRegistered() {
		return (
			<Card style={this.styles.Card}>
				<CardHeader
					title="System status"
					subtitle={this.state.systemEnabled ? "Enabled" : "Disabled"}
					avatar={this.state.systemEnabled ? <ActionLockOutline /> : <ActionLockOpen />}
				/>
				{this.state.registered ? (
					<CardText>Your system is currently not active and you are free to open and close any secured entrances</CardText>
				) : (
					<CardText>Your system is currently active and will trigger an alarm if any secured entrances are opened</CardText>
				)}
				<CardActions>{this.state.systemEnabled ? <FlatButton label="Disable" /> : <FlatButton label="Enable" />}</CardActions>
			</Card>
		);
	}

	renderSensors(){
		
	}
}
