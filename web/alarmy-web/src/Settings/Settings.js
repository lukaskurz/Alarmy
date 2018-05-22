import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import NavigationMoreVert from "material-ui/svg-icons/navigation/more-vert";
import FlatButton from "material-ui/FlatButton";
import Divider from "material-ui/Divider";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import axios from "axios";

import MessageJson from "./../MessageJson";
import "./Settings.css";

export default class SettingsComponent extends Component {
	styles = {
		AppBar: {
			IconLeft: {
				display: "none",
			},
		},
		Button: {
			Register: {
				height: "60px",
				textAlign: "left",
				textIndent: "20px",
			},
		},
		Dialog: {
			minHeight: "200px",
		},
	};

	state = {
		registerOpen: false,
		resetOpen: false,
		systemAddress: "127.0.0.1",
	};

	register() {
		axios
			.get(`http://${this.state.systemAddress}:3000`)
			.then(value => {
				console.log(value.data);
				const msg = value.data;
				localStorage.setItem("alarmy-secret", msg.secret);
			})
			.catch(error => {
				alert("Could not connect to system");
				console.log(error);
			});
	}

	render() {
		return (
			<div>
				<AppBar
					iconStyleLeft={this.styles.AppBar.IconLeft}
					title={<span>Settings</span>}
					iconElementRight={
						<IconButton>
							<NavigationMoreVert />
						</IconButton>
					}
				/>
				<div className="content">
					<FlatButton fullWidth={true} style={this.styles.Button.Register} onClick={() => this.setState({registerOpen: true})}>
						Register to new system
					</FlatButton>
					<Divider />
					<FlatButton fullWidth={true} style={this.styles.Button.Register} onClick={() => this.setState({resetOpen: true})}>
						Reset connection to system
					</FlatButton>
					<Divider />
				</div>
				{this.registerDialog()}
				{this.resetDialog()}
			</div>
		);
	}

	resetDialog(){
		const resetActions = [
			<FlatButton label="Cancel" primary={true} onClick={() => this.handleResetClose()} />,
			<FlatButton
				label="Reset"
				primary={true}
				keyboardFocused={true}
				onClick={() => {
					this.handleResetClose();
					this.reset();
				}}
			/>,
		];

		return(
			<Dialog
				title="Resetting current connection"
				actions={resetActions}
				modal={false}
				open={this.state.resetOpen}
				onRequestClose={() => this.handleResetClose()}
				autoScrollBodyContent={true}
				bodyStyle={this.styles.Dialog}
			>
				<p>Once you have resetted your connection, you won't be able to connect to it again, until you have registered to a new system.</p>
			</Dialog>
		);
	}

	handleResetClose() {
		this.setState({resetOpen: false});
	}

	reset(){
		localStorage.removeItem("alarmy-secret");
	}

	registerDialog() {
		const registerActions = [
			<FlatButton label="Cancel" primary={true} onClick={() => this.handleRegisterClose()} />,
			<FlatButton
				label="Register"
				primary={true}
				keyboardFocused={true}
				onClick={() => {
					this.handleRegisterClose();
					this.register();
				}}
			/>,
		];

		return (
			<Dialog
				title="Registering with new system"
				actions={registerActions}
				modal={false}
				open={this.state.registerOpen}
				onRequestClose={() => this.handleRegisterClose()}
				autoScrollBodyContent={true}
				bodyStyle={this.styles.Dialog}
			>
				<p>You have to be in the same network as your Alarmy system.</p>
				<TextField
					hintText={this.state.systemAddress}
					floatingLabelText="Address of your system"
					floatingLabelFixed={false}
					onChange={this.handleRegisterChange}
				/>
			</Dialog>
		);
	}

	handleRegisterChange = event => {
		this.setState({
			systemAddress: event.target.value,
		});
	};

	handleRegisterClose() {
		this.setState({registerOpen: false});
	}
}
