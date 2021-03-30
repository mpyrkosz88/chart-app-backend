var app = require('express')();
var http = require('http').Server(app);
var socketIo = require('socket.io');
var randomNumber = require('./randomNumber');


var port = process.env.PORT || 3000;

const io = socketIo(http, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    }
});

app.get('/', function (req, res) {
  res.send('Use socket.io-client to connect to the server...');
});

io.on('connection', function (socket) {
  console.log('connect');

  var unsubscribe = randomNumber.subscribe(function (number) {
    var data = {
      value: number,
      timestamp: Number(new Date()),
    };

    // console.log(data);
    socket.emit('data', data);
  });

  socket.on('disconnect', function () {
    console.log('disconnect')
    unsubscribe();
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
