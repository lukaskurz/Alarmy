import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import NavigationMoreVert from "material-ui/svg-icons/navigation/more-vert";
import FlatButton from "material-ui/FlatButton";
import Divider from "material-ui/Divider";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";

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
	};

	state = {
		registerOpen: false,
		systemAddress: "127.0.0.1",
	};

	register() {
		alert(this.state.systemAddress);
	}

	render() {
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
				</div>
				<Dialog
					title="Registering with new system"
					actions={registerActions}
					modal={false}
					open={this.state.registerOpen}
					onRequestClose={this.handleRegisterClose}
				>
					<p>You have to be in the same network as your Alarmy system.</p>
					<TextField
						hintText="172.168.100.99"
						floatingLabelText="Address of your system"
						floatingLabelFixed={false}
						onChange={this.handleRegisterChange}
					/>
				</Dialog>
			</div>
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
