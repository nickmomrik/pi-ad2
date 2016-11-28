import React from 'react';
import {Link} from 'react-router';
import {Card, CardTitle} from 'material-ui/Card';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Slider from 'material-ui/Slider';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import CircularProgress from 'material-ui/CircularProgress';
import Config from 'utils/Config';

const socket = io();

const inlineStyles = {
    card: {
        padding: 8,
    },
    section: {
        clear: 'both',
        paddingTop: 6,
        paddingBottom: 0,
        paddirgRight: 8,
        paddingLeft: 8,
    },
    spinSection: {
        float: 'left',
    },
    sectionTitle: {
        fontSize: 14,
        lineHeight: '24px',
    },
    sectionSubTitle: {
        fontSize: 12,
        paddingBottom: 10,
    },
    radio: {
        width: 'auto',
        float: 'left',
        paddingRight: 12,
    },
    radioInput: {
        marginRight: 4,
    },
    radioLabel: {
        fontSize: 12,
        marginLeft: -12
    },
    radioGroup: {
        marginLeft: 20,
    },
    slider: {
        marginTop: 8,
        marginBottom: 8,
        marginRight: 20,
        marginLeft: 20,
        width: 'auto',
        clear: 'both',
    },
    progress: {
        float: 'right',
        marginRight: 20,
    },
};


export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spinProgress: 8,
            theme: 'light',
            metric: true,
            clapDetectorAmplitude: 0.7,
            clapDetectorEnergy: 0.3,
        };
    }

    componentDidMount() {
        socket.on('spins', this.spin);

        Config.get('all', (value) => {
            value = Config.cast(JSON.parse(value));

            this.setState({
                theme: value.theme,
                metric: value.metric,
                clapDetectorAmplitude: value.clapDetectorAmplitude,
                clapDetectorEnergy: value.clapDetectorEnergy,
            });
        });
    }

    componentWillUnmount() {
        this.spinsOff();
    }

    spinsOff = () => {
        socket.off('spins', this.spin);
        socket.disconnect();
    };

    spin = (spins) => {
        console.log(spins);
        this.setState(prevState => ({
            spinProgress: (prevState.spinProgress + 1) % 11
        }));
    };

    handleTheme = (event, value) => {
        this.setState({theme: value});
        Config.put('theme', value);
    };

    handleMetric = (event, value) => {
        this.setState({metric: value});
        Config.put('metric', value);
    };

    handleAmplitude = (event, value) => {
        this.setState({clapDetectorAmplitude: value});
        Config.put('clapDetectorAmplitude', value);
    };

    handleEnergy = (event, value) => {
        this.setState({clapDetectorEnergy: value});
        Config.put('clapDetectorEnergy', value);
    };

    render() {
        return (
                <Card style={inlineStyles.card}>
                    <Link to="/app" onClick={this.spinsOff}>
                        <ArrowBackIcon />
                    </Link>

                    <CardTitle
                        title="Theme"
                        titleStyle={inlineStyles.sectionTitle}
                        style={inlineStyles.section}
                    />
                    <RadioButtonGroup
                        name="theme"
                        onChange={this.handleTheme}
                        defaultSelected={this.state.theme}
                        style={inlineStyles.radioGroup}
                    >
                        <RadioButton
                            value="light"
                            label="Light"
                            style={inlineStyles.radio}
                            inputStyle={inlineStyles.radioInput}
                            labelStyle={inlineStyles.radioLabel}
                        />
                        <RadioButton
                            value="dark"
                            label="Dark"
                            style={inlineStyles.radio}
                            inputStyle={inlineStyles.radioInput}
                            labelStyle={inlineStyles.radioLabel}
                        />
                    </RadioButtonGroup>

                    <CardTitle
                        title="Default Distance Mesurement System"
                        subtitle="Can always change on-the-fly in the timer."
                        titleStyle={inlineStyles.sectionTitle}
                        subtitleStyle={inlineStyles.sectionSubTitle}
                        style={inlineStyles.section}
                    />
                    <RadioButtonGroup
                        name="metric"
                        onChange={this.handleMetric}
                        defaultSelected={this.state.metric}
                        style={inlineStyles.radioGroup}
                    >
                        <RadioButton
                            value={true}
                            label="km"
                            style={inlineStyles.radio}
                            inputStyle={inlineStyles.radioInput}
                            labelStyle={inlineStyles.radioLabel}
                        />
                        <RadioButton
                            value={false}
                            label="Miles"
                            style={inlineStyles.radio}
                            inputStyle={inlineStyles.radioInput}
                            labelStyle={inlineStyles.radioLabel}
                        />
                    </RadioButtonGroup>

                    <CardTitle
                        title="Spin Detection"
                        subtitle="Start pedaling & adjust until spins are being shown to the right."
                        titleStyle={inlineStyles.sectionTitle}
                        subtitleStyle={inlineStyles.sectionSubTitle}
                        style={_.merge({}, inlineStyles.section, inlineStyles.spinSection)}
                    />
                    <CircularProgress
                        mode="determinate"
                        value={this.state.spinProgress}
                        max={10}
                        style={inlineStyles.progress}
                    />
                    <Slider
                        step={0.05}
                        value={this.state.clapDetectorEnergy}
                        name="clapDetectorEnergy"
                        min={0.1}
                        max={1}
                        onChange={this.handleEnergy}
                        sliderStyle={inlineStyles.slider}
                    />
                    <Slider
                        step={0.05}
                        value={this.state.clapDetectorAmplitude}
                        name="clapDetectorAmplitude"
                        min={0.1}
                        max={1}
                        onChange={this.handleAmplitude}
                        sliderStyle={inlineStyles.slider}
                    />
                </Card>
        );
    }
}
