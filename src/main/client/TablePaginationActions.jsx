import FirstPageIcon from 'material-ui-icons/FirstPage';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import LastPageIcon from 'material-ui-icons/LastPage';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';
import React, { Component } from 'react';

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5,
    },
});

class TablePaginationActions extends Component {

    handleFirstPageButtonClick = e => {
        this.props.onChangePage(e, 'first');
    };

    handleBackButtonClick = e => {
        this.props.onChangePage(e, 'prev');
    };

    handleNextButtonClick = e => {
        this.props.onChangePage(e, 'next');
    };

    handleLastPageButtonClick = e => {
        this.props.onChangePage(e, 'last');
    };

    render() {
        const { classes, count, page, rowsPerPage, theme } = this.props;

        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                >
                    <FirstPageIcon />
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    <KeyboardArrowRight />
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    <LastPageIcon />
                </IconButton>
            </div>
        );
    }
}


export default withStyles(actionsStyles)(
    TablePaginationActions,
);