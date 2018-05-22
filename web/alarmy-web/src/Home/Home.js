import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import {Card, CardActions, CardHeader, CardText} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import ActionLockOpen from "material-ui/svg-icons/action/lock-open";
import ActionLockOutline from "material-ui/svg-icons/action/lock-outline";
import AvNotInterested from "material-ui/svg-icons/av/not-interested";

export default class HomeComponent extends Component {
	styles = {
		AppBar: {
			IconLeft: {
				display: "none",
			},
		},
		Card: {
			margin: "10px",
		},
		LockButton: {
			color: "white",
		},
		NotRegistered: {
			Div: {
				width: "300px",
				height: "400px",
				margin: "auto",
			},
			Icon: {
				width: "150px",
				height: "150px",
				margin: "75px",
				marginTop: "30px",
				marginBottom: "30px",
			},
		},
	};

	render() {
		return (
			<div>
				<AppBar iconStyleLeft={this.styles.AppBar.IconLeft} title={<span>Home</span>} />
				{this.props.registered === true ? this.renderRegistered() : this.renderNotRegistered()}
			</div>
		);
	}

	renderRegistered() {
		return (
			<Card style={this.styles.Card}>
				<CardHeader
					title="System status"
					subtitle={this.props.systemEnabled ? "Enabled" : "Disabled"}
					avatar={this.props.systemEnabled ? <ActionLockOutline /> : <ActionLockOpen />}
				/>
				{this.props.systemEnabled ? (
					<CardText>Your system is currently active and will trigger an alarm if any secured entrances are opened</CardText>
				) : (
					<CardText>Your system is currently not active and you are free to open and close any secured entrances</CardText>
				)}
				<CardActions>
					{this.props.systemEnabled ? (
						<FlatButton
							label="Disable"
							backgroundColor="#ff4081"
							hoverColor="#ff8db4"
							style={this.styles.LockButton}
							onClick={() => this.props.onSystemEnabledChange(false)}
						/>
					) : (
						<FlatButton
							label="Enable"
							backgroundColor="#a4c639"
							hoverColor="#8AA62F"
							style={this.styles.LockButton}
							onClick={() => this.props.onSystemEnabledChange(true)}
						/>
					)}
				</CardActions>
			</Card>
		);
	}

	renderNotRegistered() {
		return (
			<div style={this.styles.NotRegistered.Div}>
				<AvNotInterested style={this.styles.NotRegistered.Icon} />
				<p>You are currently not registered to any alarmy system.</p>
				<p>Go to the settings section and register to a new system.</p>
			</div>
		);
	}

	renderSensors() {}
}
