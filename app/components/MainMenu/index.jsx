import React from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import TimerIcon from 'material-ui/svg-icons/image/timer';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import ThemeProvider from 'react-theme-provider';


export default class MainMenu extends React.Component {
    render() {
        return (
            <ThemeProvider>
                <Paper>
                    <List>
                        <ListItem
                            primaryText="Workout Now"
                            leftIcon={<TimerIcon />}
                            href="/#/timer"
                        />
                        <ListItem
                            primaryText="Settings"
                            leftIcon={<SettingsIcon />}
                            href="/#/settings"
                        />
                        <ListItem
                            primaryText="Exit"
                            leftIcon={<ExitIcon />}
                            href="/#/exit"
                        />
                    </List>
                </Paper>
            </ThemeProvider>
        );
    }
}
