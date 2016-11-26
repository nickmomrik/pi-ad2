import React from 'react';
import {CardTitle, CardActions, CardHeader} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router'
const pkg = require('../../../package.json');

export default class SplashOverlay extends React.Component {
    render() {
        return (
            <div>
                <CardTitle
                    title={pkg.name}
                    subtitle={pkg.version}
                    titleColor="#FFFFFF"
                    subtitleColor="#CCCCCC" />
                <CardActions>
                    <Link to="/app"><RaisedButton label="Workout Now!" /></Link>
                </CardActions>
            </div>
        );
    }
}
