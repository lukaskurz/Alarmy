import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {Card} from "material-ui/Card";

export default class HistoryComponent extends Component {
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
				<AppBar iconStyleLeft={this.styles.AppBar.IconLeft} title={<span>History</span>} />
				{this.renderTable()}
			</div>
		);
	}

	renderTable(){
		let elements = [];

		for(let i = this.props.history.length-1; i > 0; i--){
			let split = this.props.history[i].content.split("/");
			elements.push(
			<TableRow>
				<TableRowColumn>{new Date(this.props.history[i].timestamp).toLocaleString()}</TableRowColumn>
				<TableRowColumn>{split[0]}</TableRowColumn>
				<TableRowColumn>{split[1]}</TableRowColumn>
				<TableRowColumn>{split[2]}</TableRowColumn>
			</TableRow>)
		}

		return(
			<Card style={this.styles.Card}>
				<Table selectable={false}>
					<TableHeader>
						<TableRow>
							<TableHeaderColumn>Datetime</TableHeaderColumn>
							<TableHeaderColumn>Room</TableHeaderColumn>
							<TableHeaderColumn>Position</TableHeaderColumn>
							<TableHeaderColumn>Type</TableHeaderColumn>
						</TableRow>
					</TableHeader>
					<TableBody>
						{elements}
					</TableBody>
				</Table>
			</Card>
		);
	}
}
