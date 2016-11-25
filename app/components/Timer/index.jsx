import React from 'react';
import {Button, IconButton} from 'react-toolbox/lib/button';
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card';

import 'style.scss';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card id="ui" className="imperial rpms">
                <Card>
                    <CardTitle title="00:00" />
                    <Button raised>Play</Button>
                    <Button raised>Pause</Button>
                    <Button raised>Stop</Button>
                    <Button raised>Exit</Button>
                </Card>
                <Card>
                    <CardTitle
                        title="0"
                        subtitle="Calories"
                    />
                </Card>
                <Card>
                    <CardTitle
                        title="0.00"
                        subtitle="Miles"
                    />
                </Card>
                <Card>
                    <CardTitle
                        title="0.0"
                        subtitle="MPH"
                    />
                </Card>
                <Card>
                    <CardTitle
                        title="0"
                        subtitle="RPM"
                    />
                </Card>
            </Card>
        );
    }
}
