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
		console.log('ROOM INITIALIZE');

	};

/*	var Risk = require('./risk.js'),
		risk = new Risk(numPlayers);

	this.clientSockets = [];

	var resetSocketsRoom = function() {
		this.clientSockets = [];
		risk = new Risk(numPlayers);
	};

	var emptyRoom = function() {
		var roomClients = io.sockets.adapter.rooms[this.roomName];

		this.players = [];
		for (var clientId in roomClients) {
			io.sockets.connected[clientId].leave(this.roomName);
			io.sockets.connected[clientId].removeAllListeners();
		}

		// Remove room from pool
		for (var i = 0; i < rooms.length; i++) {
			if (rooms[i].roomName === this.roomName) {
				rooms.splice(i, 1);
				break;
			}
		}
	};

	var updatePartyTurn = function(party) {
		// Last client had the turn, pass to the first one
		if (party[party.length - 1].activeTurn) {
			party[0].activeTurn = true;
			party[party.length - 1].activeTurn = false;
		} else {
			for (var i = 0; i < party.length; i++) {
				if (party[i].activeTurn) {
					party[i + 1].activeTurn = true;
					party[i].activeTurn = false;
					break;
				}
			}
		}

		return party;
	};



		// Every time this method is called, it is call via .bind or .call to have the own object scope into the sockets event scope
		var initSetUp = function() {	
			// Sends to player who owns the turn
			this.clientSockets[turnToken].emit('turnSetupStarted', risk.graph, risk.lastRegion, risk.setUpArmySize);	
			if (!listenerActive[turnToken]) {
				// Listens player who owns the turn on turnFinished once
				this.clientSockets[turnToken].on('turnSetupFinished', function(graph, region, party) {
					risk.graph = graph;
					risk.lastRegion = region;
					party = updatePartyTurn(party);

					// Sends updated data to all players in the room except the one who perform the action
					for (var i = 0; i < this.clientSockets.length; i++) {
						this.clientSockets[i].emit('updateGraph', risk.graph, risk.lastRegion, party);
					}
					turnToken++;

					// Allows dinamic number  of players
					if (turnToken < this.clientSockets.length) {
						// Same turn, another player
						initSetUp.call(this);
					} else {
						// Turn has finished for all players. Checks if setup phase has finished
						turnToken = 0;
						risk.setUpArmySize--;

						// Checks if all players setup their armies
						if (risk.setUpArmySize > 0) {
							// Sends to first player is his turn if deployment has not finished
							initSetUp.call(this);
						} else {
							// Sends to room members setup phase has finished
							io.to(this.roomName).emit('setupPhaseFinished', risk.graph);
							initGame.call(this);
						}
					}
				}.bind(this));
				listenerActive[turnToken] = true;
			}
		};
		
		var initChat = function() {
			for (var i = 0; i < this.clientSockets.length; i++) {
				this.clientSockets[i].on('partyMessage', function(msg, userId) {
					io.to(this.roomName).emit('broadcastedPartyMessage', msg, userId);
				}.bind(this));			
			}
		};

		// Reset sockets every time the room is initialize
		resetSocketsRoom.call(this);
		for (var clientId in roomClients) {
			// Stores the client sockets of the room
		    this.clientSockets.push(io.sockets.connected[clientId]);
		    listenerActive.push(false);
		}
		
		// Initialize room chat
		initChat.call(this);
		// Setup begins
		initSetUp.call(this);
	};*/
};