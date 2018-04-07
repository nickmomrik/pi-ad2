import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/index.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import styles from "./style.scss";

ReactDOM.render(<App />, document.getElementById('root'));
