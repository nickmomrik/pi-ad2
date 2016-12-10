const _ = require('lodash');
const os = require('os');
const path = require('path');
const Config = require('./app/utils/Config');
const configPath = path.join(os.homedir(), '.pi-ad2');
let CONFIG = Config.settings(configPath);
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT || 3000;
const app = express();
const isLinux = ('Linux' == os.type());
const debug = require('debug')('pi-ad2');
const multer  = require('multer')();
let chromium = null;
const clapDetector = require('clap-detector');

function api_routes() {
	app.get('/api/config/:option', function(req, res) {
		let value = null;

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
			for (let key in req.body) {
				if (key in CONFIG) {
					debug('Saving ' + key + ' config: ' + req.body[key]);
					CONFIG[key] = req.body[key];
					CONFIG = Config.cast(CONFIG);
					Config.saveCustomSettings(CONFIG, configPath);

					if (_.startsWith(key, 'clapDetector')) {
						let clapKey = key.replace('Detector', '_') + '_threshold';
						clapKey = clapKey.toUpperCase();
						let newConfig = {};
						newConfig[clapKey] = CONFIG[key];
						clapDetector.updateConfig(newConfig);
					} else if ( 'theme' == key ) {
						io.emit('themeChange', CONFIG[key]);
					}
				}
			}

			res.sendStatus(200);
		}
	});
}

function maybe_start_chromium() {
	if (!chromium) {
		debug('Starting chromium on Linux');
		const proc = require('child_process');
		chromium = proc.spawn('chromium-browser', ['--noerrdialogs', '--kiosk', 'http://localhost:' + port]);
	}
}

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

	app.use(middleware);
	app.use(webpackHotMiddleware(compiler));

	api_routes();

	app.get('/', function response(req, res) {
		res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
		res.end();
	});

	if (isLinux) {
		middleware.waitUntilValid(function () {
			maybe_start_chromium();
		});
	}
} else {
	app.use(express.static(__dirname + '/dist'));

	api_routes();

	app.get('*', function response(req, res) {
		res.sendFile(path.join(__dirname, 'dist/index.html'));
	});

	if (isLinux) {
		maybe_start_chromium();
	}
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
	CLAP_MAX_DURATION: 100,
	MAX_HISTORY_LENGTH: 12
});

clapDetector.onClap(function(history) {
	debug('detected');

	io.emit('spins', history);
});
