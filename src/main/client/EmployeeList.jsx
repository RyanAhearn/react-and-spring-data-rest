import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination, TableRowColumn } from 'material-ui/Table';
import Paper from 'material-ui/Paper';


import Employee from './Employee';
import TablePaginationActions from './TablePaginationActions';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        maxWidth: 800,
        margin: 'auto',
    },
    table: {
        minWidth: 700,
        maxWidth: 800,
    },
    button: {
        margin: theme.spacing.unit,
    },
    footer: {
        float: 'right',
    },
});


class EmployeeList extends Component {

    constructor(props) {
        super(props);
    }

    handleChangePage = (e, page) => {
        if (typeof page === 'number') return;
        this.props.onNavigate(this.props.links[page].href);
    };

    render() {
        const employees = this.props.employees.map(employee =>
            <Employee 
                key={employee.entity._links.self.href} 
                employee={employee}
                attributes={this.props.attributes} 
                onDelete={this.props.onDelete} 
                onUpdate={this.props.onUpdate}
            />
        );
        const { classes } = this.props;
        return (
            <Paper className={classes.root} >
                <Table className={classes.table} >
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Manager</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                colSpan={5}
                                count={this.props.count}
                                rowsPerPage={this.props.pageSize}
                                page={this.props.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.props.onChangePageSize}
                                Actions={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </Paper>
        );
    }
};

export default withStyles(styles)(EmployeeList);