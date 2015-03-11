'use strict';

var port = process.env.PORT || 80,
	path = require('path'),
    app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    UUID = require('node-uuid'),
    Handshake = require('./connection/handshake.js')(io, UUID),
    Rooms = require('./room/rooms.js'),
    rooms = new Rooms(io);

/**
  * Server listens on port
  */
server.listen(port);

/**
  * Router redirects GET requests to index.html
  */
app.get('/', function(req, res) { 
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
}); 

/**
  * Router redirects GET requests to the file requested
  */
app.get('/*', function(req, res) {
	var file = req.params[0]; 

	// Send the requested file
	res.sendFile(path.join(__dirname, '../public', file));
});

/**
  * socket.io connection event
  */
io.on('connection', function(socket) {
	// Waiting some time ensures client has been initialize properly and it's listening to events
	setTimeout(function() {
		io.sockets.emit('availableRooms', rooms.getRoomsBasicInfo());

		socket.on('createRoom', function(numPlayers) {
			rooms.createRoom(numPlayers);
			io.sockets.emit('availableRooms', rooms.getRoomsBasicInfo());
		});

		socket.on('joinRoom', function(roomName) {
			Handshake.joinRoom(this, rooms, roomName);
		});
	}, 1000);
});

