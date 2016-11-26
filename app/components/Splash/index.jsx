import React from 'react';
import {Card, CardMedia} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SplashOverlay from 'components/Splash/SplashOverlay';

export default class Splash extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Card>
                    <CardMedia overlay={<SplashOverlay />}>
                        <img src="images/pi-ad2-blend.jpg" />
                    </CardMedia>
                </Card>
            </MuiThemeProvider>
        );
    }
}
