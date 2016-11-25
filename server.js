/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(express.static(path.join(__dirname, 'app', 'public')));
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('/', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

const http = app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> Listening on port %s.', port);
});

const io = require('socket.io')(http);
const os = require('os');
const proc = require('child_process');
const debug = require('debug')('pi-ad2');
const clapDetector = require('clap-detector');
const _ = require('lodash');

io.on('connection', function(socket) {
  debug('connection');

  socket.on('start', function() {
    debug('start');

      clapDetector.start({
          DETECTION_PERCENTAGE_START: '5%',
          DETECTION_PERCENTAGE_END: '5%',
          CLAP_AMPLITUDE_THRESHOLD: 0.1,
          CLAP_ENERGY_THRESHOLD: 0.8,
          CLAP_MAX_DURATION: 100
      });

      clapDetector.onClap(function(history) {
          debug('detected');

          io.emit('spins', _.map(history, 'time'));
      });
  }).on('exit', function() {
    debug('exit');

    if ('Linux' == os.type()) {
      debug('Kill chromium on Linux');
      chromium.kill('SIGINT');
    }

    process.exit();
  });
});

if ('Linux' == os.type()) {
  debug('Starting chromium on Linux');
  var chromium = proc.spawn('chromium-browser', ['--noerrdialogs', '--kiosk', 'http://localhost:3000']);
}
