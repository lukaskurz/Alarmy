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

import "./App.css";

const GLOBALPROXY = {
	URL: "globproxy.htl.harwoeck.at",
	WEBSOCKETPORT: "8082",
};

export default class App extends Component {
	state = {
		selectedIndex: 1,
		registered: false,
		systemEnabled: false,
		systemAddress: "127.0.0.1",
	};

	styles = {
		bottomNav:{
			position: "fixed",
			bottom: 0,
			width: "100vw",
		},
		iconStyles:{
			marginRight: 24,
		}
	};

	constructor() {
		super();
		if (localStorage.getItem("alarmy-secret")) {
			this.state.registered = true;
		}

		this.onRegisterChange = this.onRegisterChange.bind(this);
		this.onSystemAddressChange = this.onSystemAddressChange.bind(this);
		this.onSystemEnabledChange = this.onSystemEnabledChange.bind(this);
	}

	onSystemAddressChange(address){
		this.setState({systemAddress: address});
	}

	onRegisterChange(registered){
		this.setState({registered: registered});
	}

	onSystemEnabledChange(locked){
		this.setState({systemEnabled: locked});
	}

	select = index => this.setState({selectedIndex: index});

	render() {
		return (
			<MuiThemeProvider>
				{this.state.selectedIndex === 0 ? (
					<HistoryComponent/>
				): this.state.selectedIndex === 1 ? (
					<HomeComponent
					registered={this.state.registered}
					systemEnabled={this.state.systemEnabled}
					onSystemEnabledChange={this.onSystemEnabledChange}/>
				): this.state.selectedIndex === 2 ? (
					<SettingsComponent 
					systemAddress={this.state.systemAddress} 
					onSystemAddressChange={this.onSystemAddressChange}
					onRegisterChange={this.onRegisterChange}/>
				):<p>Error</p>}
				<Paper zDepth={1} style={this.styles.bottomNav}>
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
