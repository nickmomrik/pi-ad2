var clapDetector = require('clap-detector'),
    _ = require('lodash');

var ad2 = (function() {
    var spinTimes = [],
        data = {
            second: 0,
            calories: 0,
            distance: 0
        },
        callback = null;


    function calculateRPMs() {
        var len = spinTimes.length,
            maxUse = 6,
            start,
            intervals;

        if (len < 2) {
            return 0;
        }

        if (len < maxUse) {
            start = 0;
            intervals = len - 1;
        } else {
            start = len - maxUse;
            intervals = maxUse - 1;
        }

        return _.round(( 60 / ( ( spinTimes[len - 1] - spinTimes[start] ) / intervals / 1000 ) ));
    }

    function everySecond() {
        if (spinTimes.length > 1) {
            data.second++;

            // From the AD2 manual: "The Console pauses if the pedaling is less than 5 RPM for 3 seconds."
            // Use 2 instead because you can't even come close to going that slow and still register.
            if (Date.now() - spinTimes[spinTimes.length - 1] > 2000) {
                spinTimes = [];
                return;
            }

            var rpms = calculateRPMs();
            if (rpms > 0) {
                data.calories += 0.059 * Math.exp(0.026 * rpms); // y = 0.059e^(0.026x)

                var speed = _.round((rpms / ( 10 / 3 )), 2);

                data.distance += speed / 60 / 60;

                var min = Math.floor(data.second / 60),
                    sec = data.second - (60 * min);

                callback({
                    time    : _.padStart(min, 2, '0') + ':' + _.padStart(sec, 2, '0'),
                    calories: Math.floor(data.calories),
                    speed   : speed,
                    distance: _.round(data.distance, 3),
                    rpms    : rpms
                });
            }
        }
    }

    return {
        start: function (cb) {
            if (cb) {
                callback = cb;
            }

            clapDetector.start({
                DETECTION_PERCENTAGE_START: '5%',
                DETECTION_PERCENTAGE_END: '5%',
                CLAP_AMPLITUDE_THRESHOLD: 0.1,
                CLAP_ENERGY_THRESHOLD: 0.8,
                CLAP_MAX_DURATION: 100
            });

            clapDetector.onClap(function () {
                var now = Date.now();
                spinTimes.push(now);
            });

            setInterval(everySecond, 1000);
        }
    };
})();

module.exports = ad2;