import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import StopIcon from 'material-ui/svg-icons/av/stop';
import {Card, CardTitle} from 'material-ui/Card';
import TimerInfo from 'components/TimerInfo';
import _ from 'lodash';
const socket = io();

import styles from "./style.scss";
const inlineStyles = {
    title: {
        fontSize: 42
    },
    time: {
        padding : 0,
        width   : '100%'
    },
    timeTitle: {
        padding : 0
    }
};

export default class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playStart : 0,
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
        socket.emit('start');

        this.setState({playStart: Date.now()});

        // Update the timer every second
        this.interval = setInterval(() => this.everySecond(), 1000);

        socket.on('spins', function (spins) {
            this.setState({
                spins: spins
            })
        }.bind(this));
    }

    stop() {
        this.setState({stopped: true});

        // Catch up on the last second before stopping.
        setTimeout(() => clearInterval(this.interval), 1000);
    }

    everySecond() {
        let newState = {seconds: this.state.seconds + 1};
        let spinTimes = this.state.spins;
        let now = Date.now();

        // Filter out any spins that were recorded before starting and any in the last second
        spinTimes = _.filter(spinTimes, function(time) {
           return time > this.state.playStart && this.state.playStart < (now - 1000);
        }.bind(this));

        // Skip if we haven't been spinning for at least 2 seconds
        if ( now - this.state.playStart < 2000) {
            spinTimes = [];
        } else if (spinTimes.len > 1) {
            // Skip if the last spin was more than 3 second ago.
            if (now - _.last(spinTimes) > 3000) {
                spinTimes = [];
            }
        }

        if (spinTimes.length > 1) {
            let len = spinTimes.length;
            let maxUse = 4;
            let start = 0;
            let intervals = len - 1;

            if (len > 2) {
                if (len >= maxUse) {
                    start = len - maxUse;
                    intervals = maxUse - 1;
                }

                newState.rpms = _.round(( 60 / ( ( spinTimes[len - 1] - spinTimes[start] ) / intervals / 1000 ) ));

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
            <div className="container">
                <div className="row">
                    <Card className="column" containerStyle={inlineStyles.time}>
                        <CardTitle
                            title={this.time()}
                            className="time"
                            titleStyle={inlineStyles.title}
                            style={inlineStyles.timeTitle}
                        />
                    </Card>
                    <Card className="column">
                        <RaisedButton
                            tooltip="Play"
                            onClick={this.play}
                            disabled={this.state.playStart != 0}
                            icon={<PlayIcon/>}
                            className="buttonStyle column"
                            primary={true}
                        />
                        <RaisedButton
                            tooltip="Stop"
                            onClick={this.stop}
                            disabled={this.state.playStart == 0 || this.state.stopped}
                            icon={<StopIcon/>}
                            className="buttonStyle column"
                            primary={true}
                        />
                    </Card>
                </div>
                <div className="row" onClick={this.toggleEffortType}>
                    <TimerInfo
                        info={this.calories()}
                        label="Calories"
                        className="column"
                    />
                    <TimerInfo
                        info={this.effort()}
                        label={'rpm' == this.state.effortType ? 'RPM' : 'Watts'}
                        className="column"
                    />
                </div>
                <div className="row" onClick={this.toggleDistanceType}
                >
                    <TimerInfo
                        info={this.speed()}
                        label={this.state.metric ? 'km/h' : 'MPH'}
                        className="column"
                    />
                    <TimerInfo
                        info={this.distance()}
                        label={this.state.metric ? 'km' : 'Miles'}
                        className="column"
                    />
                </div>
            </div>
        );
    }
}
