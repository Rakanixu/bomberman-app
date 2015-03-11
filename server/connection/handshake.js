'use strict';
/**
 * Handshake module
 * Manage the connection and includes the client to a room
 */
module.exports = function(io, UUID) {
	return {
		joinRoom: function(socket, rooms, roomName) {
			var roomList = rooms.rooms;

			for (var i = 0; i < roomList.length; i++) {
				var room = roomList[i];

				if (room.roomName === roomName) {
					socket.userid = UUID();

					// Client joins a room
					socket.join(room.roomName);
					room.players.push({
						userId: socket.userid
					});
					
					socket.emit('onConnected', { 
						id: socket.userid,
						roomList: rooms.getRoomsBasicInfo(),
						roomName: roomName
					});
					// Broadcast to all clients
					io.sockets.emit('availableRooms', rooms.getRoomsBasicInfo());
					// Broadcast to room
					io.to(roomName).emit('updateRoom', room);

					if (room.checkFullRoom()) {
						room.assignColours();
						room.initClients();
						setTimeout(function() {
							room.initFullRoom();
						}, 1500);
					}			
					
					// Disconnection event
					socket.on('disconnect', function() {
						// Remove user from room
						room.players.splice(room.players.indexOf(socket.userid), 1);
						io.to(roomName).emit('partyBroken');
						socket.leave(roomName);
						console.log('User ' + socket.userid + ' disconnected');
					});

					console.log('User ' + socket.userid + ' joined room ' + room.roomName);
					break;
				}
			}
		}
	}
};