import React from 'react';
import {Link} from 'react-router';
import Paper from 'material-ui/Paper';
import ThemeProvider from 'react-theme-provider';

export default class Settings extends React.Component {
    render() {
        return (
            <ThemeProvider>
                <Paper>
                    <h1>Settings</h1>
                    <Link to="/app">Back</Link>
                </Paper>
            </ThemeProvider>
        );
    }
}
