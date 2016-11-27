import React from 'react';
import {Link} from 'react-router';
import {Card, CardTitle} from 'material-ui/Card';
import ThemeProvider from 'react-theme-provider';

const socket = io();

export default class Exit extends React.Component {
    componentDidMount() {
        socket.emit('exit');
    }

    render() {
        return (
            <ThemeProvider>
                <Card>
                    <CardTitle title="All done" subtitle="Restart the app to continue" />
                </Card>
            </ThemeProvider>
        );
    }
}
