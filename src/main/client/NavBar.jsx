import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import React from 'react';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
};

function NavBar(props) {
    const { classes } = props;
    return (
        <div className={ classes.root }>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="title" color="inherit" className={ classes.flex }>
                        Payroll
                      </Typography>
                    { props.children }
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default withStyles(styles)(NavBar);