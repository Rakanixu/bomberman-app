'use strict';
/**
 * Renderer service wrapping pixi.js WebGLRenderer
 */
app.service('RendererService', [
	'$window',
	function($window) {
		var renderer = this;

		renderer.renderer = new PIXI.autoDetectRenderer($window.innerWidth, $window.innerHeight);
		renderer.renderer.totalWidth = $window.innerWidth;
		renderer.renderer.totalHeight = $window.innerHeight;
		renderer.renderer.widthDivision = 18;
		renderer.renderer.heightDivision = 12;
		renderer.renderer.quadrantX = $window.innerWidth / renderer.renderer.widthDivision;
		renderer.renderer.quadrantY =$window.innerHeight / renderer.renderer.heightDivision;
	}
]);