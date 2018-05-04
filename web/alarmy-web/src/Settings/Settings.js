import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import NavigationMoreVert from "material-ui/svg-icons/navigation/more-vert";
import FlatButton from "material-ui/FlatButton";
import Divider from 'material-ui/Divider';

import "./Settings.css";

export default class SettingsComponent extends Component {

	styles = {
		AppBar: {
			IconLeft: {
				display: "none",
			},
		},
		Button:{
			Register:{
				height:"60px",
				textAlign: "left",
				textIndent: "20px"
			},
		}
	};

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
					<FlatButton fullWidth={true} style={this.styles.Button.Register}>Register to new system</FlatButton>
					<Divider />
				</div>
			</div>
		);
	}
}
