var socket = io();

jQuery('#time span.info').text('00:00');
jQuery('#calories span.info').text(0);
jQuery('#distance span.info').text(0);
jQuery('#speed span.info').text(0);
jQuery('#rpms span.info').text(0);

jQuery('#play').on('click', function() {
    if ( ! jQuery(this).hasClass('disabled')) {
        if (jQuery('#play').hasClass('start')) {
            socket.emit('start');

            socket.on('data', function (data) {
                jQuery('#time span.info').text(data['time']);
                jQuery('#calories span.info').text(data['calories']);
                jQuery('#distance span.info.imperial').text(data['distance']);
                jQuery('#distance span.info.metric').text(convert_to_metric(data['distance'], 3));
                jQuery('#speed span.info.imperial').text(data['speed']);
                jQuery('#speed span.info.metric').text(convert_to_metric(data['speed'], 1));
                jQuery('#rpms span.info').text(data['rpms']);
            });

            jQuery('#play').removeClass('start');
        }

        jQuery('#play').addClass('disabled');
        jQuery('#pause, #stop').removeClass('disabled');
    }
});

jQuery('#pause').on('click', function() {
    if ( ! jQuery(this).hasClass('disabled')) {
        socket.emit('pause');

        jQuery('#pause').addClass('disabled');
        jQuery('#play').removeClass('disabled');
    }
});

jQuery('#stop').on('click', function() {
    if ( ! jQuery(this).hasClass('disabled')) {
        socket.emit('stop');

        jQuery('#play, #pause, #stop').addClass('disabled');
    }
});

jQuery('#exit').on('click', function() {
    socket.emit('exit');

    jQuery('#ui').hide();
    jQuery('body').css('background-color', '#000000');
});

jQuery('#distance, #speed').on('click', function() {
    jQuery('body').toggleClass('metric imperial');
    jQuery('span.metric, span.imperial').toggle();
});

function convert_to_metric(number, precision) {
    return (number / 0.62137).toFixed(precision);
}