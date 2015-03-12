'use strict';
/**
 * Scene service wrapping three.js scene
 */
app.service('SceneService', [
	'$rootScope',
	function($rootScope) {
		var scene = this;

		scene.scene = new THREE.Scene();
	}
]);