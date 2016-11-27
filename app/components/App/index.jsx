import React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import Container from 'components/Container';
import Splash from 'components/Splash';
import MainMenu from 'components/MainMenu';
import {Timer} from 'components/Timer';
import Settings from 'components/Settings';
import Exit from 'components/Exit';

export default class App extends React.Component {
    render() {
      return (
          <Router history={hashHistory}>
              <Route path='/' component={Container}>
                  <IndexRoute component={Splash} />
                  <Route path='/app' component={MainMenu} />
                  <Route path='/timer' component={Timer} />
                  <Route path="/settings" component={Settings} />
                  <Route path="/exit" component={Exit} />
              </Route>
          </Router>
      );
    }
}
