import React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import Container from '../Container/index.jsx';
import Splash from '../Splash/index.jsx';
import MainMenu from '../MainMenu/index.jsx';
import {Timer} from '../Timer/index.jsx';
import Settings from '../Settings/index.jsx';
import Exit from '../Exit/index.jsx';

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
