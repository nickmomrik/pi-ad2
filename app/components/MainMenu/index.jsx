import React from 'react';
import {Card} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import TimerIcon from 'genericons-neue-react/icons/time';
import SettingsIcon from 'genericons-neue-react/icons/cog';
import ExitIcon from 'genericons-neue-react/icons/external';
import IconButton from 'material-ui/IconButton';
import {grey100, grey900} from 'material-ui/styles/colors';

const inlineStyles = {
    icon: {
        height: 28,
        width: 28,
        margin: 10,
        padding: 0,
    },
};


export default class MainMenu extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static contextTypes = {
        theme: React.PropTypes.string
    };

    render() {
        let color = ('light' == this.context.theme) ? grey900 : grey100;

        return (
            <Card>
                <List>
                    <ListItem
                        primaryText="Workout Now"
                        leftIcon={
                            <IconButton style={inlineStyles.icon}>
                                <TimerIcon fill={color} />
                            </IconButton>
                        }
                        href="/#/timer"
                    />
                    <ListItem
                        primaryText="Settings"
                        leftIcon={
                            <IconButton style={inlineStyles.icon}>
                                <SettingsIcon fill={color} />
                            </IconButton>
                        }
                        href="/#/settings"
                    />
                    <ListItem
                        primaryText="Exit"
                        leftIcon={
                            <IconButton style={inlineStyles.icon}>
                                <ExitIcon fill={color} />
                            </IconButton>
                        }
                        href="/#/exit"
                    />
                </List>
            </Card>
        );
    }
}
