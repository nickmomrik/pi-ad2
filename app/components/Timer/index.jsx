import React from 'react';
import {Link} from 'react-router';
import PlayIcon from 'genericons-neue-react/icons/play';
import StopIcon from 'genericons-neue-react/icons/stop';
import ArrowBackIcon from 'genericons-neue-react/icons/previous';
import IconButton from 'material-ui/IconButton';
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
	icon: {
		height: 56,
		width: 56,
	},
};

class Timer extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			seconds: 0,
			playStart: 0,
			lastSpin: null,
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
		let spins = _.filter(this.state.spins, (spin) => {
			return spin.time > this.state.playStart && spin.time > (now - 5000) && spin.time <= now;
		});

		if (spins.length > 1) {
			if (now - _.last(spins).time > 2000) {
				newState.rpms = 0;
			} else {
				newState.rpms = _.round(( 60 / ( ( _.last(spins).time - _.head(spins).time ) / (spins.length - 1) / 1000 ) ));

				// Calculate calories/miles individually for each new spin
				let lastSpin = (this.state.lastSpin) ? _.find(spins, ['id', this.state.lastSpin]) : _.head(spins);
				spins = _.filter(this.state.spins, (spin) => {
					return spin.id > lastSpin.id;
				});
				newState.miles = this.state.miles;
				newState.calories = this.state.calories;
				_.forEach(spins, (spin) => {
					let spinTime = spin.time - lastSpin.time;
					let rpms = _.round(60 / (spinTime / 1000));

					newState.miles += (spinTime / 1000) * (this.milesSpeed(newState.rpms) / 60 / 60);

					// y = 1.035E-4x^2 - 1.605E-3x + 0.022
					// https://jsfiddle.net/nickmomrik/jwcp5eq1/7/
					newState.calories += (spinTime / 1000) * _.ceil((0.0001035 * Math.pow(rpms, 2)) - (0.001605 * rpms) + 0.022, 3);

					lastSpin = spin;
				});

				newState.lastSpin = lastSpin.id;
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

	milesSpeed(rpms = 0) {
		if (0 == rpms) {
			rpms = this.state.rpms;
		}
		return _.round((rpms / ( 10 / 3 )), 2)
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
			actionButton = (<ArrowBackIcon fill={color} />);
		} else if (this.state.playStart) {
			actionButton = (<StopIcon fill={color} />);
		} else {
			actionButton = (<PlayIcon fill={color} />);
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
				<IconButton style={inlineStyles.icon}>
					{actionButton}
				</IconButton>
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
					Are you sure you want to <strong>Stop</strong>?
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
