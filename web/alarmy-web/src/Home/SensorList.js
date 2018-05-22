import React, {Component} from "react";
import {List, ListItem} from "material-ui/List";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ActionPermScanWifi from "material-ui/svg-icons/action/perm-scan-wifi";
import ActionRoom from "material-ui/svg-icons/action/room";
import ActionAlarmOn from "material-ui/svg-icons/action/alarm-on";
import ActionAlarmOff from "material-ui/svg-icons/action/alarm-off";
import Subheader from "material-ui/Subheader";
import Toggle from "material-ui/Toggle";
import {Card, CardActions, CardHeader, CardText} from "material-ui/Card";
import FontIcon from 'material-ui/FontIcon';

export default class SensorListComponent extends Component {
	styles = {
		Card: {
			margin: "10px",
		},
		Alarm:{
			On:{

			},
			Off:{

			}
		}
	};

	state = {
		open: false,
	};

	handleNestedListToggle = item => {
		this.setState({
			open: item.state.open,
		});
	};

	handleToggle = () => {
		this.setState({
			open: !this.state.open,
		});
	};

	render() {
		return (
			<div>
				<Card style={this.styles.Card}>
					<CardHeader title="Sensors" subtitle="List of active sensors" avatar={<ActionPermScanWifi />} />
					<List>{this.renderRooms()}</List>
				</Card>
			</div>
		);
	}

	/**
	 * Filters all unique room ids and returns them
	 */
	getRooms() {
		let rooms = [];
		let elements = [<Subheader>Rooms</Subheader>];
		for (let i = 0; i < this.props.sensors.length; i++) {
			if (rooms.indexOf(this.props.sensors[i].room) === -1) {
				rooms.push(this.props.sensors[i].room);
				elements.push(this.getRoom(this.props.sensors[i].room));
			}
		}

		return elements;
	}

	getRoom(roomId) {
		return (
			<ListItem
				primaryText={roomId}
				leftIcon={<FontIcon className="material-icons">meeting_room</FontIcon>}
				initiallyOpen={false}
				primaryTogglesNestedList={true}
				nestedItems={this.getPositions(roomId)}
			/>
		);
	}

	getPositions(roomId) {
		let positions = [];
		let elements = [<Subheader>Positions</Subheader>];
		for (let i = 0; i < this.props.sensors.length; i++) {
			if (this.props.sensors[i].room !== roomId) {
				continue;
			}
			if (positions.indexOf(this.props.sensors[i].position) === -1) {
				positions.push(this.props.sensors[i].position);
				elements.push(this.getPosition(roomId, this.props.sensors[i].position));
			}
		}

		return elements;
	}

	getPosition(roomId, positionId) {
		return (
			<ListItem
				primaryText={positionId}
				leftIcon={<ActionRoom />}
				initiallyOpen={false}
				primaryTogglesNestedList={true}
				nestedItems={this.getTypes(roomId, positionId)}
			/>
		);
	}

	getTypes(roomId, positionId) {
		let types = [];
		let elements = [<Subheader>Types</Subheader>];
		for (let i = 0; i < this.props.sensors.length; i++) {
			if (this.props.sensors[i].room !== roomId) {
				continue;
			}
			if (this.props.sensors[i].position !== positionId) {
				continue;
			}
			if (types.indexOf(this.props.sensors[i].type) === -1) {
				types.push(this.props.sensors[i].type);
				elements.push(this.getType(roomId, positionId, this.props.sensors[i].type, this.props.sensors[i].status));
			}
		}

		return elements;
	}

	getType(roomId, positionId, typeId, status) {
		return <ListItem
		primaryText={typeId} 
		leftIcon={<ContentInbox />} 
		initiallyOpen={false} 
		primaryTogglesNestedList={true} 
		rightIcon={status?<ActionAlarmOn color="green" style={this.styles.Alarm.On}/>:<ActionAlarmOff color="red" style={this.styles.Alarm.Off}/>}/>;
	}

	renderRooms() {
		return this.getRooms();
	}
}
