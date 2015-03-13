'use strict';
/**
 * Bomberman directive
 * Wraps all the Three.js code
 */
app.directive('bombermanThreeJs', [
	'$window', 
	'SceneService', 
	'CameraService',
	'RendererService',
	'MapService',
	'BombermanService',
	function($window, scene, camera, renderer, map, bomberman) {
		var camera = camera.camera,
			scene = scene.scene,
			renderer = renderer.renderer;

		return {
			link: function ($scope, $element, attr) {
				// Appends Three.js output to the directive
				$element.append(renderer.domElement);
				// Initialize the map
				console.log(map);
				map.initMap();
				// Initialize all characters
				bomberman.initCharacters();

				var render = function () {
					requestAnimationFrame(render);
					renderer.render(scene, camera);
				};

				render();
			}
		}
	}
]);