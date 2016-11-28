import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Config from 'utils/Config.js';

const socket = io();

export default class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme: 'light',
        };
    }

    componentWillMount() {
        Config.get('theme', (value) => {
            this.setState({theme: value})
        });

        socket.on('themeChange', (theme) => {
           this.setState({theme: theme})
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(('dark' == this.state.theme) ? darkBaseTheme : lightBaseTheme)}>
               {this.props.children}
            </MuiThemeProvider>
        );
    }
}
