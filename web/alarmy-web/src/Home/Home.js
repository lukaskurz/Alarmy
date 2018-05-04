import React, {Component} from "react";
import AppBar from "material-ui/AppBar";

export default class HomeComponent extends Component{
	constructor(props){
		super(props);

	}

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
				{this.props.registred == true ?(
					<p>Registered</p>
				):(
					<p>Not Registered</p>
				)}
			</div>
		);
	}
}
