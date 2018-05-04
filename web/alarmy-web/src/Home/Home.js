import React, {Component} from "react";
import AppBar from "material-ui/AppBar";

export default class HomeComponent extends Component{
	styles = {
		AppBar: {
			IconLeft: {
				display: "none",
			}
		}
	};

	render(){
		return (
			<div>
				<AppBar
					iconStyleLeft={this.styles.AppBar.IconLeft}
					title={<span>Home</span>}
				/>
			</div>
		);
	}
}
