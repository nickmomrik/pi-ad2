var clapDetector = require('clap-detector'),
    _ = require('lodash');

clapDetector.start({
    DETECTION_PERCENTAGE_START : '5%',
    DETECTION_PERCENTAGE_END: '5%',
    CLAP_AMPLITUDE_THRESHOLD: 0.5,
    CLAP_ENERGY_THRESHOLD: 0.5,
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
        lastRPM = 0;

    /*
     Should this do some type of error correction in case a beep was missed?
     Like if the avg rpms varies too much, insert another beep in the sequence.
     */

    if (len < 6) {
        lastRPM = _.round( 60 / ( ( spinTimes[len - 1] - spinTimes[0] ) / ( len - 1 ) / 1000 ), 1 );
    } else {
        lastRPM = _.round( 60 / ( ( spinTimes[len - 1] - spinTimes[len - 6 ] ) / 5 / 1000 ), 1 );
    }

    return lastRPM;
}

function everySecond() {
    var cadence = calculateRPMs(),
        watts,
        newCalories,
        newDistance,
        speed,
        out = '';

    if ( spinTimes.length ) {
        second++;
        out = second + ' seconds: ';

        /*
         According to the AD2 manual...

         "The Console pauses if the pedaling is less than 5 RPM for 3 seconds."

         So should maybe reset the spins array if this happens, otherwise averages are wrong.
          */


        /*
            Watt & calorie formulas taken from https://unyieldingly.com/2013/02/airdyne-erg-trending/

            But calories don't match up with the AD2.
         */
        watts = _.round( ( 0.172 * Math.pow( cadence, 2 ) ) - ( 12.16 * cadence ) + 271.3, 3 );
        if ( watts > 0 ) {
            newCalories = ( ( watts * 3.9 ) / 60  ) / 60;
            calories += newCalories;

            speed = cadence / ( 10 / 3 );

            newDistance = speed / 60 / 60;
            distance += newDistance;

            //out = out + _.round( newCalories, 7) + ' new cals ';
            out = out + Math.floor( calories ) + ' total cals ';
            //out = out + _.round(newDistance, 7) + ' new miles ';
            out = out + _.round( distance, 3 ) + ' total miles ';
            out = out + cadence + ' RPMs ';
            out = out + _.round(speed, 2) + ' mph ';
            //out = out + watts + ' watts';
            console.log(out);
        }
    }
}
