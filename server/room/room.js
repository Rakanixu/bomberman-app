'use strict';

var UUID = require('node-uuid');
/**
 * Room module
 */
module.exports = function(io, size) {
	this.size = size;
	this.roomName = UUID();
	this.players = [];

	this.checkFullRoom = function() {
		if (this.players.length === this.size) {
			return true;
		} else {
			return false;
		}
	};

	this.assignColours = function() {
		var colours = [{
				colour: 'blue',
				screenLocation: 'leftTop'
			}, {
				colour: 'green',
				screenLocation: 'rightTop'
			}, {
				colour: 'red',
				screenLocation: 'leftBottom'
			}, {
				colour: 'yellow',
				screenLocation: 'rightBottom'
			}],
			party = [];

		for (var i = 0; i < this.size; i++) {
			party.push({
				colour: colours[i].colour, 
				screenLocation: colours[i].screenLocation,
				userId: this.players[i].userId
			});
		}

		// Sends the colours and the players (Ids) to all clients.
		io.to(this.roomName).emit('partyColours', party);
	};

	this.initClients = function() {
		io.to(this.roomName).emit('initBomberman');
	};

	this.initFullRoom = function() {
		var roomClients = io.sockets.adapter.rooms[this.roomName];
		
		for (var clientId in roomClients) {
			io.sockets.connected[clientId].on('moveTo', function(keyCode, userId) {
				io.to(this.roomName).emit('move', keyCode, userId);
			}.bind(this));

			io.sockets.connected[clientId].on('leaveBomb', function(userId) {
				io.to(this.roomName).emit('bomb', userId);
			}.bind(this));
		}
	};
};