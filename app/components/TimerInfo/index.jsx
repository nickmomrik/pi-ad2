import React from 'react';
import { Card, CardTitle } from 'react-toolbox/lib/card';

import 'style.scss';

export default class TimerInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div onClick={this.props.onClick}>
                <Card>
                    <CardTitle
                        title={this.props.info.toString()}
                        subtitle={this.props.label}
                    />
                </Card>
            </div>
        );
    }
}
