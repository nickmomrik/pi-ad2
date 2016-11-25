import React from 'react';
import Timer from 'components/Timer';

import 'style.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Timer />
    );
  }
}
