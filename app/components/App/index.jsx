import React from 'react';
import Timer from 'components/Timer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Config from 'utils/Config.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        theme: 'light',
    };
  }

  componentWillMount() {
      Config.get('theme', function(value) { this.setState({theme: value})}.bind(this));
  }

  render() {
      if ('light' == this.state.theme) {
          return (
              <MuiThemeProvider>
                  <Timer />
              </MuiThemeProvider>
          );
      } else {
          return (
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                  <Timer />
              </MuiThemeProvider>
          );
      }
  }
}
