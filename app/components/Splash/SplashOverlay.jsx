import React from 'react';
import {CardTitle, CardHeader} from 'material-ui/Card';
import {grey200, grey400} from 'material-ui/styles/colors';
const pkg = require('../../../package.json');
const image = require('images/nick-momrik.jpeg');

export default class SplashOverlay extends React.Component {
	render() {
		return (
			<div>
				<CardTitle
					title="Pi AD2"
					titleColor={grey200}
					subtitle={'v' + pkg.version}
					subtitleColor={grey400} />
				<CardHeader
					avatar={image}
					title="by Nick Momrik"
					titleColor={grey200}
					subtitle="nickmomrik.com"
					subtitleColor={grey400}
				/>
			</div>
		);
	}
}
