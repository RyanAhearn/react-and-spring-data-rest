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

export default class CreateDialog extends Component {

    constructor(props) {
        super(props);
        this.state = { open: false, newEmployee: {} };

        props.attributes.forEach(attribute => {
            this.state.newEmployee[attribute] = '';
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.onCreate(this.state.newEmployee);

        this.handleClose();
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    }

    handleClose = () => {
        let change = {};
        this.props.attributes.forEach(attribute => {
            change[attribute] = '';
        });

        this.setState({ newEmployee: change });

        this.setState({ open: false });
    }

    handleChange = e => {
        let change = {};
        change[e.target.id] = e.target.value;
        this.setState({ newEmployee: Object.assign(this.state.newEmployee, change) });
    }

    render() {
        let inputs = this.props.attributes.map(attribute =>
            <TextField
                id={attribute}
                margin="dense"
                key={attribute}
                label={attribute}
                onChange={this.handleChange}
                fullWidth
            />
        );
        return (
            <div>
                <Button color='inherit' onClick={this.handleClickOpen}>Create</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Create New Employee</DialogTitle>
                    {inputs}
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
};