import React from 'react';
import Timer from 'components/Timer';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import 'style.scss';

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
