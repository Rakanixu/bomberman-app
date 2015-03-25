'use strict';
/**
 * Stage service wrapping th pixi.js stage
 */
app.service('StageService', [
	'$rootScope',
	function($rootScope) {
		var stage = this;

		stage.stage = new PIXI.Stage(0x66FF99);
	}
]);