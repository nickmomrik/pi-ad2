/* eslint no-console: 0 */

const fs = require('fs')
const _ = require('lodash');
const Config = require('./app/utils/Config');
var CONFIG = Config.cast(require('./config/default.json'));
var customConfig = './config/custom.json';
if (fs.existsSync(customConfig)) {
    _.assign(CONFIG, Config.cast(require(customConfig)));
}
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
const os = require('os');
const isLinux = ('Linux' == os.type());
const debug = require('debug')('pi-ad2');
var multer  = require('multer')();
var chromium = null;
const clapDetector = require('clap-detector');

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

  // Declare API routes before '*'
  app.get('/api/config/:option', function(req, res) {
      var value = null;

      if ('all' == req.params.option) {
          value = CONFIG;
      } else if (req.params.option in CONFIG) {
          value = CONFIG[req.params.option];
      }

      res.send(value);
  });
    app.post('/api/config/:option', multer.array(), function (req, res, next) {
        if (!req.body) {
            return res.sendStatus(400)
        } else {
            for (var key in req.body) {
                if (key in CONFIG) {
                    debug('Saving ' + key + ' config: ' + req.body[key]);
                    CONFIG[key] = req.body[key];
                    CONFIG = Config.cast(CONFIG);
                    fs.writeFile(customConfig, JSON.stringify(CONFIG, null, '\t'), function(err) {
                        if (err) {
                            throw err;
                        }
                    });

                    if (_.startsWith(key, 'clapDetector')) {
                        var clapKey = key.replace('Detector', '_') + '_threshold';
                        clapKey = clapKey.toUpperCase();
                        var newConfig = {};
                        newConfig[clapKey] = CONFIG[key];
                        clapDetector.updateConfig(newConfig);
                    }
                }
            }

            res.sendStatus(200);
        }
    });

  app.get('/', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });

    if (isLinux) {
        middleware.waitUntilValid(function () {
            if (!chromium) {
                debug('Starting chromium on Linux');
                const proc = require('child_process');
                chromium = proc.spawn('chromium-browser', ['--noerrdialogs', '--kiosk', 'http://localhost:' + port]);
            }
        });
    }
} else {
  app.use(express.static(__dirname + '/dist'));

  // Declare API routes before '*'
  app.get('/api/config', function(req, res) {
    res.json(CONFIG);
  });

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

io.on('connection', function(socket) {
    debug('connection');

    socket.on('exit', function() {
        debug('exit');

        if (isLinux && chromium) {
          debug('Kill chromium on Linux');
          chromium.kill('SIGINT');
        }

        io.close();

        process.exit();
    });
});

clapDetector.start({
    DETECTION_PERCENTAGE_START: '5%',
    DETECTION_PERCENTAGE_END: '5%',
    CLAP_AMPLITUDE_THRESHOLD: CONFIG.clapDetectorAmplitude,
    CLAP_ENERGY_THRESHOLD: CONFIG.clapDetectorEnergy,
    CLAP_MAX_DURATION: 100
});

clapDetector.onClap(function(history) {
    debug('detected');

    io.emit('spins', _.map(history, 'time'));
});
