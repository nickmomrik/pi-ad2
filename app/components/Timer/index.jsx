import React from 'react';
import {Button, IconButton} from 'react-toolbox/lib/button';
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card';
import TimerInfo from 'components/TimerInfo';
import _ from 'lodash';

const socket = io();

import 'style.scss';

export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            played    : false,
            stopped   : false,
            spins     : [],
            seconds   : 0,
            calories  : 0,
            miles     : 0.000,
            metric    : true,
            effortType: 'rpm',
            rpms      : 0
        };

        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.toggleDistanceType = this.toggleDistanceType.bind(this);
        this.toggleEffortType = this.toggleEffortType.bind(this);
    }

    play() {
        this.setState({played: true});

        socket.on('spins', function (spins) {
            this.setState({
                spins: spins
            })
        }.bind(this));

        socket.emit('start');

        this.interval = setInterval(() => this.everySecond(), 1000);
    }

    stop() {
        this.setState({stopped: true});

        clearInterval(this.interval);
    }

    everySecond() {
        let newState = {
            seconds: this.state.seconds + 1
        };

        if (this.state.spins.length > 1) {
            let len = this.state.spins.length;
            let maxUse = 4;
            let start = 0;
            let intervals = len - 1;

            if (len > 2) {
                if (len >= maxUse) {
                    start = len - maxUse;
                    intervals = maxUse - 1;
                }

                newState.rpms = _.round(( 60 / ( ( this.state.spins[len - 1] - this.state.spins[start] ) / intervals / 1000 ) ));

                if (newState.rpms > 0) {
                    // y = 9.396E-5x^2 + 6.583E-4x - 0.084 from Google chart trendline
                    newState.calories = this.state.calories + _.round((0.00009396 * Math.pow(newState.rpms, 2)) + (0.0006583 * newState.rpms) - 0.084, 5);

                    newState.miles = this.state.miles + (this.milesSpeed() / 60 / 60);
                }
            }
        }

        this.setState(newState);
    }

    toggleDistanceType() {
        this.setState(prevState => ({
            metric: !prevState.metric
        }));
    }

    toggleEffortType() {
        this.setState(prevState => ({
            effortType: ('rpm' == prevState.effortType) ? 'watts' : 'rpm'
        }));
    }

    time() {
        let min = Math.floor(this.state.seconds / 60);
        let sec = this.state.seconds - (60 * min);
        return _.padStart(min, 2, '0') + ':' + _.padStart(sec, 2, '0');
    }

    calories() {
        return Math.floor(this.state.calories);
    }

    distance() {
        let distance = this.state.miles;
        if (this.state.metric) {
            distance = this.convert_miles_to_km(distance, 3);
        }

        return _.round(distance, 3).toFixed(3)
    }

    milesSpeed() {
        return _.round((this.state.rpms / ( 10 / 3 )), 2)
    }

    speed() {
        let speed = this.milesSpeed();
        if (this.state.metric) {
            speed = this.convert_miles_to_km(speed, 1);
        }

        return _.round(speed, 1).toFixed(1);
    }

    effort() {
        let effort = this.state.rpms;
        if ('rpm' != this.state.effortType && this.state.rpms > 0) {
            effort = Math.floor(0.172 * (Math.pow(this.state.rpms, 2)) - (12.16 * this.state.rpms) + 271.3);
        }

        return effort;
    }

    convert_miles_to_km(miles, precision) {
        return (miles / 0.62137).toFixed(precision);
    }

    render() {
        return (
            <Card>
                <Card>
                    <CardTitle title={this.time()} />
                    <Button raised onClick={this.play} disabled={this.state.played}>Play</Button>
                    <Button raised onClick={this.stop} disabled={!this.state.played || this.state.stopped}>Stop</Button>
                </Card>
                <TimerInfo
                    info={this.calories()}
                    label="Calories"
                />
                <TimerInfo
                    info={this.distance()}
                    label={this.state.metric ? 'km' : 'Miles'}
                    onClick={this.toggleDistanceType}
                />
                <TimerInfo
                    info={this.speed()}
                    label={this.state.metric ? 'km/h' : 'MPH'}
                    onClick={this.toggleDistanceType}
                />
                <TimerInfo
                    info={this.effort()}
                    label={'rpm' == this.state.effortType ? 'RPM' : 'Watts'}
                    onClick={this.toggleEffortType}
                />
            </Card>
        );
    }
}
