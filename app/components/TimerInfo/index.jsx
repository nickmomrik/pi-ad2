import React from 'react';
import { Card, CardTitle } from 'react-toolbox/lib/card';

import 'style.scss';

export default class TimerInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
                <CardTitle
                    title={this.props.info}
                    subtitle={this.props.label}
                />
            </Card>
        );
    }
}
