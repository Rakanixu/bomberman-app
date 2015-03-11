'use strict';
/**
 *  Bomberman game controller
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