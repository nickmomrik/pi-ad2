import React from 'react';
import {Link} from 'react-router';
import {Card, CardMedia} from 'material-ui/Card';
import SplashOverlay from 'components/Splash/SplashOverlay';
const image = require('images/pi-ad2-blend.jpg');

const inlineStyles = {
	overlay: {
		background: 'rgba(0, 0, 0, 0.75)',
	},
}

export default class Splash extends React.Component {
	render() {
		return (
			<Link to="/app">
				<Card>
					<CardMedia
						overlay={<SplashOverlay />}
						overlayContentStyle={inlineStyles.overlay}
					>
						<img src={image} />
					</CardMedia>
				</Card>
			</Link>
		);
	}
}
