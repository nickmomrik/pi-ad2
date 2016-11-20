var AD2 = require('./lib/ad2'),
    express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http)
    path = require('path');

app.use(express.static(path.join(__dirname, 'includes')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('connection');

    socket.on('start', function(){
        console.log('start');

        AD2.start(sendData);
    }).on('pause', function(){
        console.log('pause');

        AD2.pause();
    }).on('resume', function() {
        console.log('resume');

        AD2.resume();
    }).on('stop', function(){
            console.log('stop');

            process.exit();
    });
});

function sendData(data) {
    io.emit('data', data);
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});
