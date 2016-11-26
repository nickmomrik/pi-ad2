import React from 'react';
import {Card, CardTitle} from 'material-ui/Card';
import classNames from 'classnames';

import styles from "./style.scss";
const inlineStyles = {
    title: {
        fontSize: 42
    },
    container: {
        padding : 0,
        width   : '100%'
    },
    infoTitle: {
        padding : 0
    }
};

export default class TimerInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card className={classNames(this.props.className)} containerStyle={inlineStyles.container}>
                <CardTitle
                    title={this.props.info.toString()}
                    subtitle={this.props.label}
                    titleStyle={inlineStyles.title}
                    subtitleStyle={inlineStyles.subtitle}
                    className="timerInfo"
                    style={inlineStyles.infoTitle}
                />
            </Card>
        );
    }
}
