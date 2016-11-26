import React from 'react';
import {Link} from 'react-router';
import {Card, CardMedia} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SplashOverlay from 'components/Splash/SplashOverlay';

const inlineStyles = {
    overlay: {
        background: 'rgba(0, 0, 0, 0.75)',
    },
}

export default class Splash extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Link to="/app">
                    <Card>
                        <CardMedia
                            overlay={<SplashOverlay />}
                            overlayContentStyle={inlineStyles.overlay}
                        >
                            <img src="images/pi-ad2-blend.jpg" />
                        </CardMedia>
                    </Card>
                </Link>
            </MuiThemeProvider>
        );
    }
}
