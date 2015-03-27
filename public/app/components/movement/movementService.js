'use strict';
/**
 * Movement service
 */
app.service('MovementService', [
	'RendererService',
	'CollisionService',
	function(renderer, collision) {
		var movement = this,
			keyCodes = {
				left: 37,
				up: 38,
				right: 39,
				down: 40
			},
			renderer = renderer.renderer,
			speed = Math.round(renderer.quadrantX / 25);
		
		movement.setPosition = function(bomberman, key, userId) {
			var isCollision = false;

			for (var i = 0; i < bomberman.characters.length; i++) {
				if (bomberman.characters[i].userId === userId && !bomberman.characters[i].isMoving) {
					var auxCharacter = {
						width: bomberman.characters[i].width,
						height: bomberman.characters[i].height,
						position: {
							x: bomberman.characters[i].position.x,
							y: bomberman.characters[i].position.y,
						} 
					};

					// Applies the movement coordinate to the aux object
					setFuturePosition(auxCharacter, key);

					// Checks for collisions
					isCollision = collision.checkCollisions(auxCharacter);

					// No collision, movement to be applied
					if (!isCollision) {
						var moveTransition = function() {
							switch (key) {
								case keyCodes.left:
									bomberman.characters[i].position.x -= speed;
									if (bomberman.characters[i].position.x > auxCharacter.position.x) {
										requestAnimFrame(moveTransition);
									} else {
										manageStackedKeys(bomberman, bomberman.characters[i], auxCharacter, userId);
									}
									break;
								case keyCodes.up:
									bomberman.characters[i].position.y -= speed;
									if (bomberman.characters[i].position.y > auxCharacter.position.y) {
										requestAnimFrame(moveTransition);
									} else {
										manageStackedKeys(bomberman, bomberman.characters[i], auxCharacter, userId);
									}
									break;
								case keyCodes.right:
									bomberman.characters[i].position.x += speed;
									if (bomberman.characters[i].position.x < auxCharacter.position.x) {
										requestAnimFrame(moveTransition);
									} else {
										manageStackedKeys(bomberman, bomberman.characters[i], auxCharacter, userId);
									}
									break;
								case keyCodes.down:
									bomberman.characters[i].position.y += speed;
									if (bomberman.characters[i].position.y < auxCharacter.position.y) {
										requestAnimFrame(moveTransition);
									} else {
										manageStackedKeys(bomberman, bomberman.characters[i], auxCharacter, userId);
									}
									break;
							}
						};

						bomberman.characters[i].isMoving = true;
						// Executes the movement transition visualization
						requestAnimFrame(moveTransition);
					}

					break;
				}
			}
		};

		var setFuturePosition = function(character, key) {
			switch (key) {
				case keyCodes.left:
					character.position.x -= renderer.quadrantX;
					break
				case keyCodes.up:
					character.position.y -= renderer.quadrantY;
					break;
				case keyCodes.right:
					character.position.x += renderer.quadrantX;
					break;
				case keyCodes.down:
					character.position.y += renderer.quadrantY;
					break;
			}	
		};

		var manageStackedKeys = function(bomberman, character, auxCharacter, userId) {
			// Due to speed, pixel calculus is not exact if character moves more than one pixel per frame
			character.position.x = auxCharacter.position.x;
			character.position.y = auxCharacter.position.y;
			character.isMoving = false;

			if (character.keyOnStack !== null) {
				movement.setPosition(bomberman, character.keyOnStack, userId);
				character.keyOnStack = null;
			}
		};
	}
]);