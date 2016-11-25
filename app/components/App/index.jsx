import React from 'react';
import 'style.scss';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div id="ui" className="imperial rpms">
          <div id="time">
            <span className="info"></span>
            <span id="buttons">
                <span id="play" className="start">
                    <img src="/images/play.svg" />
                </span>
                <span id="pause" className="disabled">
                    <img src="/images/pause.svg" />
                </span>
                <span id="stop" className="disabled">
                    <img src="/images/stop.svg" />
                </span>
                <span id="exit">
                    <img src="/images/close.svg" />
                </span>
            </span>
          </div>
          <div id="calories">
            <span className="title">Calories</span><br />
            <span className="info"></span>
          </div>
          <div id="distance">
            <span className="title imperial">Miles</span>
            <span className="title metric">km</span><br />
            <span className="info imperial"></span>
            <span className="info metric"></span>
          </div>
          <div id="speed">
            <span className="title imperial">MPH</span>
            <span className="title metric">km/h</span><br />
            <span className="info imperial"></span>
            <span className="info metric"></span>
          </div>
          <div id="rpms">
            <span className="title rpms">RPM</span>
            <span className="title watts">Watts</span><br />
            <span className="info rpms"></span>
            <span className="info watts"></span>
          </div>
        </div>
    );
  }
}
