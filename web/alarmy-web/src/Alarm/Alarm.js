import React, {Component} from "react";
import AlertWarning from "material-ui/svg-icons/alert/warning";
import RaisedButton from 'material-ui/RaisedButton';

export default class AlarmComponent extends Component {
	styles={
		Wrapper:{
			position: "fixed",
			top: "0px",
			left: "0px",
			bottom: "0px",
			right: "0px",
			backgroundColor: "red",
			zIndex: "2000",
			textAlign: "center"
		},
		DangerIcon:{
			margin: "auto",
			width: "300px",
			height: "300px",
			display: "block",
		},
		DangerFont:{
			color:"white",
			textTransform: "uppercase",
			fontSize: "40px",
			display: "block",
			margin: "auto",
			textAlign: "center",
			fontWeight: "700"
		},
		ButtonWrapper:{
			margin: "auto",
			width: "100vw",
			display: "inline-block"
		},
		DangerButton: {
			margin: "20px"
		},
	}

	render(){
		return(
			<div style={this.styles.Wrapper}>
			<AlertWarning style={this.styles.DangerIcon}color="white"/>
			<p style={this.styles.DangerFont}>There has been a breach of the alarm system!</p>
			<div style={this.styles.ButtonWrapper}>
			<RaisedButton label="Acknowledged, Turn off" labelColor="red" style={this.styles.DangerButton} onClick={() => this.props.onAlarmTriggeredChange(true)}/>
			<RaisedButton label="Ignore" labelColor="red" style={this.styles.DangerButton} onClick={() => this.props.onAlarmTriggeredChange(false)}/>
			</div>
			</div>
		);
	}
}
