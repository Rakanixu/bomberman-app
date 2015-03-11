'use strict';

var Room = require('./room.js');
/**
 * Rooms module
 */
module.exports = function(io) {
	this.rooms = [];

	this.createRoom = function(size) {
		this.rooms.push(new Room(io, size));
	};

	this.getRoomsBasicInfo = function() {
		var roomsInfo = [];

		for (var i = 0; i < this.rooms.length; i++) {
			roomsInfo[i] = {
				size: this.rooms[i].size,
				players: this.rooms[i].players,
				roomName: this.rooms[i].roomName
			};
		}

		return roomsInfo;
	};
};