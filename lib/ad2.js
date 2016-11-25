var clapDetector = require('clap-detector'),
    _ = require('lodash')
    debugAD2 = require('debug')('ad2');

var ad2 = (function() {
    var spinTimes = [],
        data = {
            second: 0,
            calories: 0,
            distance: 0
        },
        callback = null,
        interval = null;

    debugAD2('initializing');

    function calculateRPMs() {
        var len = spinTimes.length,
            maxUse = 4,
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
                // y = 9.396E-5x^2 + 6.583E-4x - 0.084 from Google chart trendline
                data.calories += _.ceil((0.00009396 * Math.pow(rpms, 2)) + (0.0006583 * rpms) - 0.084, 3);

                var speed = _.round((rpms / ( 10 / 3 )), 2);

                data.distance += speed / 60 / 60;

                var min = Math.floor(data.second / 60),
                    sec = data.second - (60 * min),
                    returnData = {
                        time    : _.padStart(min, 2, '0') + ':' + _.padStart(sec, 2, '0'),
                        calories: Math.floor(data.calories),
                        speed   : speed.toFixed(1),
                        distance: _.round(data.distance, 3).toFixed(3),
                        rpms    : rpms,
                        watts   : Math.floor(0.172 * (Math.pow(rpms, 2)) - (12.16 * rpms) + 271.3)
                    };

                debugAD2(returnData);
                callback(returnData);
            }
        }
    }

    return {
        start: function (cb) {
            debugAD2('start');

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

            interval = setInterval(everySecond, 1000);

            clapDetector.onClap(function(history) {
                debugAD2('detected');

                spinTimes = _.map(history, 'time');;
            });
        },

        pause: function() {
            debugAD2('pause');

            clapDetector.pause();

            clearInterval(interval);
        },

        resume: function() {
            debugAD2('resume');

            spinTimes = [];

            interval = setInterval(everySecond, 1000);

            clapDetector.resume();
        }
    };
})();

module.exports = ad2;