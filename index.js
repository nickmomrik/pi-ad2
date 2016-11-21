var AD2     = require('./lib/ad2'),
    express = require('express'),
    app     = express(),
    http    = require('http').Server(app),
    io      = require('socket.io')(http)
    path    = require('path'),
    os      = require('os'),
    proc    = require('child_process'),
    debug = require('debug')('pi-ad2');

app.use(express.static(path.join(__dirname, 'includes')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    debug('connection');

    socket.on('start', function() {
        debug('start');

        AD2.start(sendData);
    }).on('pause', function() {
        debug('pause');

        AD2.pause();
    }).on('resume', function() {
        debug('resume');

        AD2.resume();
    }).on('stop', function() {
        debug('stop');

        AD2.pause();
    }).on('exit', function() {
        debug('exit');

        if ('Linux' == os.type()) {
            debug('Kill chromium on Linux');
            chromium.kill('SIGINT');
        }

        process.exit();
    });
});

function sendData(data) {
    io.emit('data', data);
}

http.listen(3000, function(){
    debug('listening on *:3000');
});

if ('Linux' == os.type()) {
    debug('Starting chromium on Linux');
    var chromium = proc.spawn('chromium-browser', ['--noerrdialogs', '--kiosk', 'http://localhost:3000']);
}
