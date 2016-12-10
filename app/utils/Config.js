const fs = require('fs');
const path = require('path');
const _ = require('lodash');

let Config = (function() {
	const types = {
		theme: "string",
		metric: "bool",
		clapDetectorAmplitude: "number",
		clapDetectorEnergy: "number",
	};
	const defaults = {
		theme: "light",
		metric: true,
		clapDetectorAmplitude: 0.1,
		clapDetectorEnergy: 0.8,
	};
	const customConfigFile = 'config.json';

	return {
		get: function(option, callback) {
			fetch('/api/config/' + option).then(function(response) {
				return response.text().then(function(value) {
					if (value === 'true') {
						value = true;
					} else if (value === 'false') {
						value = false;
					}

					if (value !== null) {
						callback(value);
					}
				});
			});
		},
		put: function(option, value) {
			let form = new FormData();
			form.append(option, value);
			// Should probably test the result here
			fetch('/api/config/' + option, {
				method: "POST",
				body: form
			});
		},
		// Fixes proper types since the JSON functions make everything a string
		cast: function(config) {
			for (let k in config) {
				if (k in types) {
					switch (types[k]) {
						case 'number':
							config[k] = Number(config[k]);
							break;
						case 'bool':
							config[k] = ('true' === config[k] || true === config[k]);
							break;
						case 'string':
						default:
							break;
					}
				}
			}

			return config;
		},
		settings: function(configPath) {
			let settings = defaults;
			if (fs.existsSync(path.join(configPath, customConfigFile))) {
				_.assign(settings, Config.cast(require(path.join(configPath, customConfigFile))));
			}

			return settings;
		},
		saveCustomSettings: function(settings, configPath) {
			if (!fs.existsSync(configPath)){
				fs.mkdirSync(configPath);
			}

			fs.writeFile(path.join(configPath, customConfigFile), JSON.stringify(settings, null, '\t'), function(err) {
				if (err) {
					throw err;
				}
			});
		}
	};
})();

module.exports = Config;