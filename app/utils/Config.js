var Config = (function() {
    return {
        get: function (option, callback) {
            fetch('/api/get/config/' + option).then(function(response) {
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
        }
    };
})();

module.exports = Config;