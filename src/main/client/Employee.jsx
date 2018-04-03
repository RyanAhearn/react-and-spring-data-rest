import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { TableRow, TableCell } from 'material-ui/Table'
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';

const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3,
		overflowX: 'auto',
	},
	table: {
		minWidth: 700,
	},
});

export default class Employee extends Component {

	constructor(props) {
		super(props);
	}

	handleDelete = () => {
		this.props.onDelete(this.props.employee);
	}

	render() {
		return (
			<TableRow>
				<TableCell>{ this.props.employee.entity.firstName }</TableCell>
				<TableCell>{ this.props.employee.entity.lastName }</TableCell>
				<TableCell>{ this.props.employee.entity.description }</TableCell>
				<TableCell>
					<IconButton onClick={this.handleDelete} aria-label='Delete'>
						<DeleteIcon />
					</IconButton>
				</TableCell>
			</TableRow>
		);
	}
};

//export default withStyles(styles)(Employee);