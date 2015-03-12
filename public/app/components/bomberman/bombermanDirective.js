'use strict';
/**
 * Bomberman directive
 * Wraps all the Three.js code
 */
app.directive('bombermanThreeJs', [
	'$window', 
	'SceneService', 
	'CameraService',
	'HandshakeService',
	'BombermanService',
	function($window, scene, camera, handshake, bomberman) {
		var camera = camera.camera,
			scene = scene.scene;

		return {
			link: function ($scope, $element, attr) {
				var renderer = new THREE.WebGLRenderer();

				renderer.setSize($window.innerWidth, $window.innerHeight);
				$element.append(renderer.domElement);

				bomberman.initCharacters();


				for (var i = 0; i < bomberman.characters.length; i++) {
					scene.add(bomberman.characters[i]);
				}






				var render = function () {
					requestAnimationFrame(render);
					
					if (bomberman.characters[0].position.x > (camera.visibleWidth/2) - 50) {
						bomberman.characters[0].position.x -= 5;
					} else if (bomberman.characters[0].position.x <= ((camera.visibleWidth/2) - 50)) {
						bomberman.characters[0].position.x += 5;
					}
					//console.log(mesh.position.x)
					renderer.render(scene, camera);
				};

				render();
			}
		}
	}
]);