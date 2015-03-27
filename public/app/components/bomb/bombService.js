'use strict';
/**
 * Bomb service
 */
app.service('BombService', [
	'StageService',
	'RendererService',
	function(stage, renderer) {
		var bomb = this,
			stage = stage.stage,
			renderer = renderer.renderer,
			bombTimeout = 3000;

		bomb.setBomb = function(character) {
			createBomb(character);
		};

		var createTextures = function(type) {
			var textures = [];

			for (var j = 1; j <= 4; j++){
				var texture = PIXI.Texture.fromFrame(type + j + '.png');
				textures.push(texture);
			}

			return textures;
		};

		var getPosition = function(character) {
			var position = {},
				xTile = Math.round(character.position.x / renderer.quadrantX),
				yTile = Math.round(character.position.y / renderer.quadrantY);

			position.x = xTile * renderer.quadrantX;
			position.y = yTile * renderer.quadrantY;

			return position;
		};

		var createBomb = function(character) {
			var bomb = new PIXI.MovieClip(createTextures('bomb')),
				position = getPosition(character);

			bomb.width = renderer.quadrantX;
			bomb.height = renderer.quadrantY;
			bomb.position.x = position.x;
			bomb.position.y = position.y;
			bomb.animationSpeed = 0.1;
            bomb.gotoAndPlay(0);
            stage.addChild(bomb);

            setTimeout(function() {
            	explodeBomb(bomb);
            }, bombTimeout);
		};

		var explodeBomb = function(bomb) {
			stage.removeChild(bomb);
			createExplosion(bomb);
		};

		var createExplosion = function(bomb) {
			var explosion = new PIXI.MovieClip(createTextures('explosion'));

			explosion.width = renderer.quadrantX;
			explosion.height = renderer.quadrantY;
			explosion.position.x = bomb.position.x;
			explosion.position.y = bomb.position.y;
			explosion.animationSpeed = 0.5;
            explosion.gotoAndPlay(0);
            stage.addChild(explosion);

		};
	}
]);