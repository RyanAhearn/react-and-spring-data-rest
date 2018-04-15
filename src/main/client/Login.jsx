import classNames from 'classnames';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import React from 'react';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 50,
        marginTop: theme.spacing.unit * 3,
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: 500,
    }),
    margin: {
        margin: 'auto',
        width: '90%',
    },
    textField: {
        flexBasis: 200,
    },
    button: {
        float: 'right',
        margin: theme.spacing.unit,
    },
});

function Login(props) {
    const { classes } = props;
    return (
        <Paper className={classes.root} >
            <form action='/login' method='post'>
                <div>
                    <FormControl className={classNames(classes.margin, classes.textField)}>
                        <InputLabel htmlFor='username'>Username</InputLabel>
                        <Input
                            id='username'
                            type='text'
                            name='username'
                        />
                    </FormControl>
                </div>
                <div>
                    <FormControl className={classNames(classes.margin, classes.textField)}>
                        <InputLabel htmlFor='password'>Password</InputLabel>
                        <Input
                            id='password'
                            type='password'
                            name='password'
                        />
                    </FormControl>
                </div>
                <div>
                    <Button className={classes.button} color='primary' type='submit'>Login</Button>
                </div>
            </form>
        </Paper>
    );
}

export default withStyles(styles)(Login);