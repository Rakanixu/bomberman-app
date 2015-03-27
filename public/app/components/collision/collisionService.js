'use strict';
/**
 * Collision service
 */
app.service('CollisionService', [
	'RendererService',
	'MapService',
	function(renderer, map) {
		var collision = this,
			renderer = renderer.renderer;

		collision.checkCollisions = function(character) {
			var collision = false;

			for (var j = 0; j < map.boxes.breakable.length; j++) {
				if (checkCollision(character, map.boxes.breakable[j])) {
					collision = true;
				}
			}

			for (var j = 0; j < map.boxes.noBreakable.length; j++) {
				if (checkCollision(character, map.boxes.noBreakable[j])) {
					collision = true;
				}
			}

			if (character.position.x < 0 || 
					character.position.y < 0 || 
					character.position.x > (renderer.quadrantX * (renderer.widthDivision - 2)) || 
					character.position.y > (renderer.quadrantY * (renderer.heightDivision - 2))) {
				collision = true;
			}

			return collision;
		};

		var checkCollision = function(sprite1, sprite2) {
			return !(sprite2.position.x >= (sprite1.position.x + sprite1.width - 5) || 
				(sprite2.position.x + sprite2.width - 5) <= sprite1.position.x || 
				sprite2.position.y >= (sprite1.position.y + sprite1.height - 5) ||
				(sprite2.position.y + sprite2.height - 5) <= sprite1.position.y);
	    };
	}
]);