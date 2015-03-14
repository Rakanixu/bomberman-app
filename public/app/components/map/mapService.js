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
							var box = createBox(j, i, stoneMaterial, false);

							map.boxes.noBreakable.push(box);
							scene.add(box);
						}
					}
				}
			}
			
			// Creates the breakable boxes
			for (var j = 0; j < camera.heightRatio - 1; j++) {
				for (var i = 0; i < camera.widthRatio - 1; i++) {
					if ((i % 2 === 0 || j % 2 === 0) && 
							(j >= 1 && i >= 1) && 
							(j <= camera.heightRatio - 3 && i <= camera.widthRatio - 3)) {
						var box = createBox(j, i, woodMaterial, true);

						map.boxes.breakable.push(box);
						scene.add(box);
					}// else {
						// if (j === 0) {
						
						// }
					// }
				}
			}			
		};
		
		var createBox = function(hIndex, wIndex, material, breakable) {
			var box = new THREE.Mesh(geometry, material);

			box.position.x = -((camera.visibleWidth / 2) - camera.quadrantX) + (camera.quadrantX * wIndex);
			box.position.y =  ((camera.visibleHeight / 2) - camera.quadrantY) - (camera.quadrantY * hIndex);
			box.breakable = breakable;		
			
			return box;
		};
	}
]);