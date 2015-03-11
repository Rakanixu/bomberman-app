'use strict';
/**
 * Handshake service
 */
app.service('HandshakeService', [
	'$rootScope', 
	'$window', 
	'$location',
	function($rootScope, $window, $location) {
		var handshake = this;

		handshake.userId = null;
		handshake.room = null;
		handshake.party = null;
		handshake.roomList = [];
		handshake.roomCreatedByUser = false;
		handshake.clientInRoom = false;
		handshake.roomSize = null;
		handshake.roomSizeSelector = [
			{
				numPlayers: 2,
				val: '2 players'
			},
			{
				numPlayers: 3,
				val: '3 players'
			},
			{
				numPlayers: 4,
				val: '4 players'
			}
		];

		handshake.createRoom = function() {
			handshake.roomCreatedByUser = true;
			Socket.emit('createRoom', handshake.roomSize.numPlayers);
		};

		handshake.joinRoom = function(roomName) {
			handshake.clientInRoom = true;
			handshake.room = getRoom(roomName);
			Socket.emit('joinRoom', roomName);
		};

		handshake.initListeners = function() {
			/**
			  * onConnected event. Client receives userId assign by server.
			  */
			Socket.on('onConnected', function(init) {
				$rootScope.$apply(function() {
					handshake.userId = init.id;
					handshake.roomList = init.roomList;
					handshake.room = getRoom(init.roomName);
				});
			});

			/**
			  * availableRooms event. Server sends the available rooms to join.
			  */
			Socket.on('availableRooms', function(rooms) {
				$rootScope.$apply(function() {
					handshake.roomList = rooms;
				});
			});

			/**
			  * updateRoom event. Server sends the last data of the room.
			  */
			Socket.on('updateRoom', function(room) {
				$rootScope.$apply(function() {
					handshake.room = room;
				});
			});		

			/**
			  * playerColour event. Server assigns different colours for every player.
			  */
			Socket.on('partyColours', function(party) {
				$rootScope.$apply(function() {
					handshake.party = party
				});
			});

			/**
			  * initBomberman event. Client may route to the game phase
			  */
			Socket.on('initBomberman', function() {
				$rootScope.$apply(function() {
					$location.path('/bomberman');
				});
			});		

			/**
			  * partyBroken event - user left the room
			  * Resets game due to user left room
			  */
			Socket.on('partyBroken', function() {
				$rootScope.$apply(function() {
					// Force a hard app reset by closing current socket and connecting to server again
					$window.location.href = '/';
				});
			});	
		};

		var getRoom = function(roomName) {
			for (var i = 0; i < handshake.roomList.length; i++) {
				if (roomName === handshake.roomList[i].roomName) {
					return handshake.roomList[i];
				}
			}
		};
	}
]);