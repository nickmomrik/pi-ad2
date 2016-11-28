import React from 'react';
import {Link} from 'react-router';
import {Card, CardTitle} from 'material-ui/Card';

const socket = io();

export default class Exit extends React.Component {
    componentDidMount() {
        socket.emit('exit');

        socket.disconnect();
    }

    render() {
        return (
            <Card>
                <CardTitle title="All done" subtitle="Restart the app to continue" />
            </Card>
        );
    }
}
