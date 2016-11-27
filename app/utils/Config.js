var Config = (function() {
    return {
        get: function (option, callback) {
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
            var form = new FormData();
            form.append(option, value);
            // Should probably test the result here
            fetch('/api/config/' + option, {
                method: "POST",
                body: form
            });
        }
    };
})();

module.exports = Config;