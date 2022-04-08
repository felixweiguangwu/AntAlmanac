import React from 'react';
import { Grid, CssBaseline, useMediaQuery } from '@mui/material';
import Calendar from '../Calendar/ScheduleCalendar';
import Bar from './CustomAppBar';
import DesktopTabs from '../CoursePane/DesktopTabs';
import NotificationSnackbar from './NotificationSnackbar';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileHome from './MobileHome';

const Home = () => {
    const isMobileScreen = useMediaQuery('(max-width: 750px)');

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <Bar />
            {isMobileScreen ? (
                <MobileHome />
            ) : (
                <Grid container alignItems={'stretch'} style={{ flexGrow: '1' }}>
                    <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
                        <Calendar />
                    </Grid>
                    <Grid item xs={12} s={6} md={6} lg={6} xl={6}>
                        <DesktopTabs style={{ height: 'calc(100vh - 58px)' }} />
                    </Grid>
                </Grid>
            )}
            <NotificationSnackbar />
        </LocalizationProvider>
    );
};

export default Home;
