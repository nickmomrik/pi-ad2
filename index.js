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
        maxUse = 4,
        start,
        intervals;

    if ( len < 2 ) {
        return 0;
    }

    /*
     Should this do some type of error correction in case a beep was missed?
     Like if the avg rpms varies too much, insert another beep in the sequence.
     */

    if ( len < maxUse ) {
        start = 0;
        intervals = len - 1;
    } else {
        start = len - maxUse;
        intervals = maxUse - 1;
    }

    return _.round( ( 60 / ( ( spinTimes[ len - 1 ] - spinTimes[ start ] ) / intervals / 1000 ) ), 4 );
}

function everySecond() {
    var cadence = calculateRPMs(),
        watts,
        newCalories,
        newDistance,
        speed,
        out = '';

    if ( spinTimes.length > 1 ) {
        second++;
        out = second + ' seconds: ';

        // From the manual - The Console pauses if the pedaling is less than 5 RPM for 3 seconds.
        if ( Date.now() - spinTimes[ spinTimes.length - 1 ] > 2000 ) {
            spinTimes = [];
            return;
        }

        if ( cadence > 0 ) {
            newCalories = 0.043 * Math.exp( 0.032 * cadence );
            calories += newCalories;

            speed = cadence / ( 10 / 3 );

            newDistance = speed / 60 / 60;
            distance += newDistance;

            out = out + _.round( newCalories, 7) + ' new cals ';
            out = out + Math.floor( calories ) + ' cals ';
            //out = out + _.round(newDistance, 7) + ' new miles ';
            out = out + _.round( distance, 3 ) + ' miles ';
            out = out + _.round( speed, 2 ) + ' mph ';
            out = out + cadence + ' RPMs ';
            //out = out + watts + ' watts';
            console.log(out);

            /*
            var doAvg = 36;
            var len = spinTimes.length;
            if (doAvg == second){
                console.log('RPM average: ' + _.round( ( 60 / ( ( spinTimes[ len - 1 ] - spinTimes[ 0 ] ) / (len-1) / 1000 ) ), 4 ))
            }
            */
        }
    }
}
