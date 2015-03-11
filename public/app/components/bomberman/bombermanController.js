'use strict';
/**
 *  Handshake controller
 */
app.controller('BombermanController', [
	'$scope', 
	'HandshakeService',
	'BombermanService',
	function($scope, handshake, bomberman) {
		$scope.bomberman = bomberman;
		
		bomberman.initListeners();
	}
]);