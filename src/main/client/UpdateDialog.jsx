import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

class UpdateDialog extends Component {

    constructor(props) {
        super(props);
        this.state = { open: false, updatedEmployee: {} };

        this.props.attributes.forEach(attribute => {
            this.state.updatedEmployee[attribute] = this.props.employee.entity[attribute];
        });

        this.state.updatedEmployee.manager = this.props.employee.entity.manager;
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.onUpdate(this.props.employee, this.state.updatedEmployee);

        this.setState({ open: false });
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    }

    handleClose = e => {
        e.preventDefault();
        let change = {};
        this.props.attributes.forEach(attribute => {
            change[attribute] = this.props.employee.entity[attribute];
        });

        this.setState({ open: false, updatedEmployee: change });
    }

    handleChange = e => {
        let change = {};
        change[e.target.id] = e.target.value;
        this.setState({ updatedEmployee: Object.assign(this.state.updatedEmployee, change) });
    }

    render() {
        const inputs = this.props.attributes.map(attribute =>
            <TextField
                id={attribute}
                margin="dense"
                key={attribute}
                label={attribute}
                onChange={this.handleChange}
                defaultValue={this.state.updatedEmployee[attribute]}
                fullWidth
            />
        );
        return (
            <div style={{ display: 'inline' }}>
                <IconButton onClick={this.handleClickOpen} className={this.props.classes.button} aria-label="Edit">
                    <EditIcon />
                </IconButton>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Edit Employee</DialogTitle>
                    {inputs}
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>   
                        <Button onClick={this.handleSubmit} color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(UpdateDialog);