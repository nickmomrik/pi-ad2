let Config = (function() {
    const types = {
        'theme': "string",
        'metric': "bool",
        'clapDetectorAmplitude': "number",
        'clapDetectorEnergy': "number"
    };

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
        }
    };
})();

module.exports = Config;