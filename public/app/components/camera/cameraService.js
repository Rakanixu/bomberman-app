'use strict';
/**
 * Camera service wrapping three.js camera
 */
app.service('CameraService', [
	'$rootScope',
	'$window',
	function($rootScope, $window) {
		var camera = this;

		camera.aspect = $window.innerWidth / $window.innerHeight;
		camera.camera = new THREE.PerspectiveCamera(75, camera.aspect, 1, 1000);
		camera.camera.position.z = 1000;
		camera.camera.widthRatio = 18;
		camera.camera.heightRatio = 12;

		// Visible height and width
		camera.camera.visibleHeight = 2 * Math.tan((camera.camera.fov * Math.PI / 180 )/ 2) * camera.camera.position.z;
		camera.camera.visibleWidth = camera.camera.visibleHeight * camera.aspect;

		// Quadrant sizes
		camera.camera.quadrantX = camera.camera.visibleWidth / camera.camera.widthRatio;
		camera.camera.quadrantY = camera.camera.visibleHeight / camera.camera.heightRatio;
	}
]);