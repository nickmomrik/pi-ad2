import React from 'react';
import {Card, CardTitle} from 'material-ui/Card';

export default class TimerInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
                <CardTitle
                    title={this.props.info.toString()}
                    subtitle={this.props.label}
                />
            </Card>
        );
    }
}
