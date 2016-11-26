import React from 'react';
import Timer from 'components/Timer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <MuiThemeProvider>
            <Timer />
        </MuiThemeProvider>
    );
  }
}
