'use strict';
/**
 * Renderer service wrapping three.js WebGLRenderer
 */
app.service('RendererService', [
	'$window',
	function($window) {
		var renderer = this;

		renderer.renderer = new THREE.WebGLRenderer();
		renderer.renderer.setSize($window.innerWidth, $window.innerHeight);
	}
]);