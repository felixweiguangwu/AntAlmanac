import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { withStyles } from '@mui/styles';
const styles = {
    button: {
        marginRight: '4px',
        backgroundColor: '#385EB1',
        color: '#fff',
    },
};

function CourseInfoButton({ classes, text, icon, redirectLink }) {
    const isMobileScreen = useMediaQuery('(max-width: 750px)');
    return (
        <Button
            className={classes.button}
            startIcon={!isMobileScreen && icon}
            variant="contained"
            size="small"
            onClick={(event) => {
                window.open(redirectLink);
            }}
        >
            {text}
        </Button>
    );
}

CourseInfoButton.propTypes = {
    text: PropTypes.string,
    icon: PropTypes.object,
    redirectLink: PropTypes.string,
};

export default withStyles(styles)(CourseInfoButton);
