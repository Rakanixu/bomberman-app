'use strict';
/**
 * Bomberman directive
 * Entry point for pixi.js openGL engine
 */
app.directive('bombermanThreeJs', [
	'$window', 
	'StageService', 
	'RendererService',
	'MapService',
	'BombermanService',
	function($window, stage, renderer, map, bomberman) {
		var stage = stage.stage,
			renderer = renderer.renderer;

			var animate = function() {
				requestAnimFrame(animate);
				// Render the stage
				renderer.render(stage);
			};

		return {
			link: function ($scope, $element, attr) {
				var assetsToLoader = [
						'assets/data/spriteBarbarian.json', 
						'assets/data/spriteCossack.json',
						'assets/data/spriteLady.json',
						'assets/data/spriteKotetsu.json',
						'assets/data/spriteBomb.json',
						'assets/data/spriteExplosion.json'
					],
					loader = new PIXI.AssetLoader(assetsToLoader, true);

				var onAssetsLoaded = function() {
					// Initialize the map
					map.initMap();
					// Initialize all characters
					bomberman.initCharacters();

					requestAnimFrame(animate);
				};					

				loader.onComplete = onAssetsLoaded;
				loader.load();

				// Appends pixi.js output to the directive
				$element.append(renderer.view);
			}
		}
	}
]);