'use strict';
/**
 * Map service. Creates the three.js map
 */
app.service('MapService', [
	'CameraService',
	'SceneService',
	'RendererService',
	function(camera, scene, renderer) {
		var map = this,
			camera = camera.camera,
			scene = scene.scene,
			renderer = renderer.renderer,
			geometry = new THREE.BoxGeometry(camera.quadrantX, camera.quadrantY, 50),
			stoneTexture = THREE.ImageUtils.loadTexture('assets/img/stoneBox.png'),
			woodTexture = THREE.ImageUtils.loadTexture('assets/img/woodBox.gif'),
			stoneMaterial = null,
			woodMaterial = null;

		stoneTexture.anisotropy = renderer.getMaxAnisotropy();
		woodTexture.anisotropy = renderer.getMaxAnisotropy();
		stoneMaterial = new THREE.MeshBasicMaterial({map: stoneTexture});
		woodMaterial = new THREE.MeshBasicMaterial({map: woodTexture});

		map.boxes = {
			noBreakable: [],
			breakable: []
		};

		map.initMap = function() {
			// Creates the static stone boxes
			for (var j = 0; j < camera.heightRatio - 1; j++) {
				if (j % 2 !== 0) {
					for (var i = 0; i < camera.widthRatio - 1; i++) {
						if (i % 2 !== 0) {
							var stoneBox = new THREE.Mesh(geometry, stoneMaterial);

							stoneBox.position.x = -((camera.visibleWidth / 2) - camera.quadrantX) + (camera.quadrantX * i);
							stoneBox.position.y =  ((camera.visibleHeight / 2) - camera.quadrantY) - (camera.quadrantY * j);
							stoneBox.breakable = false;

							map.boxes.noBreakable.push(stoneBox);
							scene.add(stoneBox);
						}
					}
				}
			}
			
			// Creates the breakable boxes
			for (var j = 0; j < camera.heightRatio - 1; j++) {
				for (var i = 0; i < camera.widthRatio - 1; i++) {
					if ((i % 2 === 0 || j % 2 === 0) && (j > 2 && i > 2) && (j < camera.heightRatio - 4 && i < camera.widthRatio - 4)) {
						var woodBox = new THREE.Mesh(geometry, woodMaterial);

						woodBox.position.x = -((camera.visibleWidth / 2) - camera.quadrantX) + (camera.quadrantX * i);
						woodBox.position.y =  ((camera.visibleHeight / 2) - camera.quadrantY) - (camera.quadrantY * j);
						woodBox.breakable = true;

						map.boxes.breakable.push(woodBox);
						scene.add(woodBox);
					}
				}
			}			
		};
	}
]);