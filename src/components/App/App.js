import React, { PureComponent } from 'react';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import ReactGA from 'react-ga';
import { undoDelete } from '../../actions/AppStoreActions';
import AppStore from '../../stores/AppStore';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feedback from './Feedback';
import Home from './Home';
import { isDarkMode } from '../../helpers';

class App extends PureComponent {
    state = {
        darkMode: isDarkMode(),
    };

    componentDidMount = () => {
        document.addEventListener('keydown', undoDelete, false);

        AppStore.on('themeToggle', () => {
            this.setState({ darkMode: isDarkMode() });
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (AppStore.getTheme() === 'auto') {
                this.setState({ darkMode: e.matches });
            }
        });

        ReactGA.initialize('UA-133683751-1');
        ReactGA.pageview('/homepage');
    };

    componentWillUnmount() {
        document.removeEventListener('keydown', undoDelete, false);
    }

    render() {
        const theme = createTheme({
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        a: {
                            color: this.state.darkMode ? 'dodgerblue' : 'blue',
                        },
                        'div .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '0 !important',
                            borderBottomWidth: '1px !important',
                        },
                    },
                },
            },
            palette: {
                mode: this.state.darkMode ? 'dark' : 'light',
                primary: {
                    main: '#305db7',
                },
            },
        });

        return (
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <StyledEngineProvider injectFirst>
                                <ThemeProvider theme={theme}>
                                    <Home />
                                </ThemeProvider>
                            </StyledEngineProvider>
                        }
                    />
                    <Route exact path="/feedback" element={<Feedback />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
