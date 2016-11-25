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

const AD2 = require('./app/AD2');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const os = require('os');
const proc = require('child_process');
const debug = require('debug')('pi-ad2');

app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s.', port);
});


io.on('connection', function(socket) {
  debug('connection');

  socket.on('start', function() {
    debug('start');

    AD2.start(sendData);
  }).on('pause', function() {
    debug('pause');

    AD2.pause();
  }).on('play', function() {
    debug('play');

    AD2.resume();
  }).on('stop', function() {
    debug('stop');

    AD2.pause();
  }).on('exit', function() {
    debug('exit');

    if ('Linux' == os.type()) {
      debug('Kill chromium on Linux');
      chromium.kill('SIGINT');
    }

    process.exit();
  });
});

function sendData(data) {
  io.emit('data', data);
}

if ('Linux' == os.type()) {
  debug('Starting chromium on Linux');
  var chromium = proc.spawn('chromium-browser', ['--noerrdialogs', '--kiosk', 'http://localhost:3000']);
}
