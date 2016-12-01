import React from 'react';
import {Link} from 'react-router';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import StopIcon from 'material-ui/svg-icons/av/stop';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import {grey400, grey700} from 'material-ui/styles/colors';
import {Card, CardTitle} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Config from 'utils/Config.js';
import classNames from 'classnames';
import _ from 'lodash';

const socket = io();

import styles from "./style.scss";
const inlineStyles = {
    title: {
        fontSize: 42,
    },
    time: {
        padding: 0,
        width: '100%',
    },
    timeTitle: {
        padding : 0,
    },
    margins: {
        margin: 12,
    },
    infoTitle: {
        fontSize: 42,
        paddingBottom: 10,
    },
    container: {
        padding : 0,
        width   : '100%',
    },
    infoCardTitle: {
        padding : 0,
    },
};

class Timer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            seconds: 0,
            playStart: 0,
            stopped: false,
            confirmOpen: false,
            spins: [],
            seconds: 0,
            calories: 0,
            miles: 0.000,
            metric: true,
            effortType: 'rpm',
            rpms: 0,
        };
    }

    static contextTypes = {
        theme: React.PropTypes.string
    };

    componentWillMount() {
        socket.on('spins', this.updateSpins);

        Config.get('metric', function(value) { this.setState({metric: value})}.bind(this));
    }

    componentWillUnmount() {
        this.spinsOff();
    }

    timerClick = () => {
        if (this.state.playStart) {
            this.setState({confirmOpen: true});
        } else {
            this.setState({
                playStart: Date.now(),
            });

            setTimeout(this.everySecond, 200);
        }
    };

    updateSpins = (spins) => {
        this.setState({
            spins: spins
        })
    };

    spinsOff = () => {
        socket.off('spins', this.updateSpins);
        socket.disconnect();
    };

    handleConfirm = () => {
        if (!this.state.stopped) {
            this.spinsOff();

            this.setState({stopped: true});
        }

        this.handleCancel();
    };

    handleCancel = () => {
        this.setState({confirmOpen: false});
    };

    everySecond = () => {
        if (this.state.stopped) {
            return;
        }

        let now = Date.now();
        let elapsed = now - this.state.playStart - (1000 * this.state.seconds);
        let shift = elapsed % 200;
        if (elapsed < (shift * 200)) {
            shift = shift - 200;
        }
        setTimeout(this.everySecond, 200 - shift);

        if (5 <= _.round(elapsed / 200)) {
            let seconds = _.round((now - this.state.playStart) / 1000);
            this.setState({
                seconds: seconds,
            });

            this.doCalculations(this.state.playStart + (seconds * 1000));
        }
    };

    doCalculations(now) {
        let newState = {};
        let spinTimes = this.state.spins;

        // Only use spins detected after start and before timestamp being processing
        spinTimes = _.filter(spinTimes, (time) => {
            return time > this.state.playStart && time <= now;
        });

        if (spinTimes.length > 1) {
            // Skip if the last spin was more than 3 second ago.
            if (now - _.last(spinTimes) > 2000) {
                spinTimes = [];
                newState.rpms = 0;
            } else {
                let len = spinTimes.length;
                let maxUse = 5;
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
        }

        this.setState(newState);
    }

    toggleDistanceType = () => {
        this.setState(prevState => ({
            metric: !prevState.metric
        }));
    };

    toggleEffortType = () => {
        this.setState(prevState => ({
            effortType: ('rpm' == prevState.effortType) ? 'watts' : 'rpm'
        }));
    };

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

        return _.round(distance, 2).toFixed(2)
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
        let actionButton;
        let color = ('light' == this.context.theme) ? grey400 : grey700;

        if (this.state.stopped) {
            actionButton = (<ArrowBackIcon
                style={inlineStyles.margins}
                color={color}
            />);
        } else if (this.state.playStart) {
            actionButton = (<StopIcon
                style={inlineStyles.margins}
                color={color}
            />);
        } else {
            actionButton = (<PlayIcon
                style={inlineStyles.margins}
                color={color}
            />);
        }

        const actions = [
            <RaisedButton
                label="No"
                primary={true}
                onClick={this.handleCancel}
                style={inlineStyles.margins}
            />,
            <RaisedButton
                label="Yes"
                primary={true}
                onClick={this.handleConfirm}
                style={inlineStyles.margins}
            />,
        ];

        let TimerDiv =
            <Card className="column" containerStyle={inlineStyles.time}>
                <CardTitle
                    title={this.time()}
                    className="time"
                    titleStyle={inlineStyles.title}
                    style={inlineStyles.timeTitle}
                />
                {actionButton}
            </Card>;
        if (this.state.stopped) {
            TimerDiv = <Link to="/app" className="row">{TimerDiv}</Link>;
        } else {
            TimerDiv = <div className="row" onClick={this.timerClick}>{TimerDiv}</div>;
        }

        return (
            <Paper className="container">
                {TimerDiv}
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
                <div className="row" onClick={this.toggleDistanceType}>
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
                <Dialog
                    title="Please Confirm"
                    actions={actions}
                    modal={false}
                    open={this.state.confirmOpen}
                    onRequestClose={this.handleCancel}
                >
                    Are you sure you want to <strong>{this.state.stopped ? 'Exit' : 'Stop'}</strong>?
                </Dialog>
            </Paper>
        );
    }
}

class TimerInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card className={classNames(this.props.className)} containerStyle={inlineStyles.container} style={this.props.style}>
                <CardTitle
                    title={this.props.info.toString()}
                    subtitle={this.props.label}
                    titleStyle={inlineStyles.infoTitle}
                    subtitleStyle={inlineStyles.subtitle}
                    className="timerInfo"
                    style={inlineStyles.infoCardTitle}
                />
            </Card>
        );
    }
}

module.exports = {
    Timer,
    TimerInfo,
};
