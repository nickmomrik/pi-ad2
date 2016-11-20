var clapDetector = require('clap-detector'),
    _ = require('lodash');

clapDetector.start({
    DETECTION_PERCENTAGE_START : '5%',
    DETECTION_PERCENTAGE_END: '5%',
    CLAP_AMPLITUDE_THRESHOLD: 0.1,
    CLAP_ENERGY_THRESHOLD: 0.8,
    CLAP_MAX_DURATION: 100
});

var spinTimes = [],
    second = 0,
    calories = 0,
    distance = 0;

clapDetector.onClap(function() {
    var now = Date.now();
    spinTimes.push(now);
});

setInterval( everySecond, 1000 );

function calculateRPMs() {
    var len = spinTimes.length,
        maxUse = 6,
        start,
        intervals;

    if ( len < 2 ) {
        return 0;
    }

    if ( len < maxUse ) {
        start = 0;
        intervals = len - 1;
    } else {
        start = len - maxUse;
        intervals = maxUse - 1;
    }

    return _.round( ( 60 / ( ( spinTimes[ len - 1 ] - spinTimes[ start ] ) / intervals / 1000 ) ) );
}

function everySecond() {
    var cadence = calculateRPMs(),
        newCalories,
        newDistance,
        speed,
        out = '';

    if ( spinTimes.length > 1 ) {
        second++;

        var min = Math.floor(second / 60),
            sec = second - (60 * min);
        out = min + ':' + _.padStart(sec, 2, '0') + ' - ';

        // From the AD2 manual: "The Console pauses if the pedaling is less than 5 RPM for 3 seconds."
        // Use 2 instead because you can't even come close to going that slow and still register.
        if ( Date.now() - spinTimes[ spinTimes.length - 1 ] > 2000 ) {
            spinTimes = [];
            return;
        }

        if ( cadence > 0 ) {
            newCalories = 0.065 * Math.exp( 0.025 * cadence ); // y = 0.065e^(0.025x)
            calories += newCalories;

            speed = cadence / ( 10 / 3 );

            newDistance = speed / 60 / 60;
            distance += newDistance;

            out = out + Math.floor( calories ) + ' cals ';
            out = out + _.round( distance, 3 ) + ' miles ';
            out = out + _.round( speed, 2 ) + ' mph ';
            out = out + cadence + ' RPMs ';
            console.log(out);
        }
    }
}
