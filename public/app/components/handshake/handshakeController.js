'use strict';
/**
 *  Handshake controller
 */
app.controller('HandshakeController', [
	'$scope', 
	'HandshakeService', 
	function($scope, handshake) {
		$scope.handshake = handshake;

		handshake.initListeners();
	}
]);