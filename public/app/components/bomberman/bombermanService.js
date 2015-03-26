'use strict';
/**
 * Bomberman service
 */
app.service('BombermanService', [
	'$rootScope',
	'HandshakeService',
	'StageService',
	'RendererService',
	'MapService',
	function($rootScope, handshake, stage, renderer, map) {
		var bomberman = this,
			keyCodes = {
				left: 37,
				up: 38,
				right: 39,
				down: 40
			},
			screenLocation = {
				leftTop: 'leftTop',
				rightTop: 'rightTop',
				leftBottom: 'leftBottom',
				rightBottom: 'rightBottom'
			},
			stage = stage.stage,
			renderer = renderer.renderer,
			speed = Math.round(renderer.quadrantX / 25);

		bomberman.characters = [];
		bomberman.characterIndex = null;

		bomberman.initListeners = function() {
			Socket.on('move', function(keyCode, userId) {

				for (var i = 0; i < bomberman.characters.length; i++) {
					if (bomberman.characters[i].isMoving && bomberman.characters[i].userId === userId) {
						bomberman.characters[i].keyOnStack = keyCode;
					} else {
						bomberman.characters[i].keyOnStack = null;
					}
				}

				setPosition(keyCode, userId);
			});
		}; 

		bomberman.keydown = function($event) {
			var position = bomberman.characters[bomberman.characterIndex].position;
			
			switch ($event.keyCode) {
				case keyCodes.left:
					Socket.emit('moveTo', keyCodes.left, handshake.userId);
					break;
				case keyCodes.up:
					Socket.emit('moveTo', keyCodes.up, handshake.userId);
					break;
				case keyCodes.right:
					Socket.emit('moveTo', keyCodes.right, handshake.userId);
					break;
				case keyCodes.down:
					Socket.emit('moveTo', keyCodes.down, handshake.userId);
					break;
			}
		};

		bomberman.initCharacters = function() {
			for (var i = 0; i < handshake.party.length; i++) {
				var textures = [],
					charName = '';

				if (i === 0) {
					charName = 'barbarian';
				} else if (i === 1) {
					charName = 'cossack';
				} else if (i === 2) {
					charName = 'lady';
				} else if (i === 3) {
					charName = 'kotetsu';
				}

				for (var j = 1; j <= 5; j++){
					var texture = PIXI.Texture.fromFrame(charName + j + '.png');
					textures.push(texture);
				}

				bomberman.characters.push(createCharacter(handshake.party[i], textures));
				
				if (bomberman.characters[i].userId === handshake.userId) {
					bomberman.characterIndex = i;
				}
			}

			for (var i = 0; i < bomberman.characters.length; i++) {
				stage.addChild(bomberman.characters[i]);
			}
		};

		var createCharacter = function(partyPlayerInfo, textures) {
            var character = new PIXI.MovieClip(textures);

			character.width = renderer.quadrantX;
			character.height = renderer.quadrantY;
			character.animationSpeed = 0.08;
            character.gotoAndPlay(0);

			switch (partyPlayerInfo.screenLocation) {
				case screenLocation.leftTop: 
					character.position.x = 0;
					character.position.y = 0;
					break;
				case screenLocation.rightTop:
					character.position.x = renderer.quadrantX * (renderer.widthDivision - 2);
					character.position.y = 0;
					break;
				case screenLocation.leftBottom:
					character.position.x = 0;
					character.position.y = renderer.quadrantY * (renderer.heightDivision - 2);
					break;
				case screenLocation.rightBottom:
					character.position.x = renderer.quadrantX * (renderer.widthDivision - 2);
					character.position.y = renderer.quadrantY * (renderer.heightDivision - 2);
					break;
			}

			character.userId = partyPlayerInfo.userId;
			character.isMoving = false;
			character.keyOnStack = null;

			return character;
		};
		
		var setPosition = function(key, userId) {
			var collision = false;

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
					collision = checkCollisions(auxCharacter);

					// No collision, movement to be applied
					if (!collision) {
						var moveTransition = function() {
							switch (key) {
								case keyCodes.left:
									bomberman.characters[i].position.x -= speed;
									if (bomberman.characters[i].position.x > auxCharacter.position.x) {
										requestAnimFrame(moveTransition);
									} else {
//REFACTOR ELSE FOR THIS GIVEN SWITCH
//CODE REPEATED EVERY WHERE
										// Due to speed, pixel calculus is not exact if character moves more than one pixel per frame
										bomberman.characters[i].position.x = auxCharacter.position.x;
										bomberman.characters[i].isMoving = false;

										if (bomberman.characters[i].keyOnStack !== null) {
											setPosition(bomberman.characters[i].keyOnStack, userId);
											bomberman.characters[i].keyOnStack = null;
										}
									}
									break;
								case keyCodes.up:
									bomberman.characters[i].position.y -= speed;
									if (bomberman.characters[i].position.y > auxCharacter.position.y) {
										requestAnimFrame(moveTransition);
									} else {
										// Due to speed, pixel calculus is not exact if character moves more than one pixel per frame
										bomberman.characters[i].position.y = auxCharacter.position.y;
										bomberman.characters[i].isMoving = false;

										if (bomberman.characters[i].keyOnStack !== null) {
											setPosition(bomberman.characters[i].keyOnStack, userId);
											bomberman.characters[i].keyOnStack = null;
										}
									}
									break;
								case keyCodes.right:
									bomberman.characters[i].position.x += speed;
									if (bomberman.characters[i].position.x < auxCharacter.position.x) {
										requestAnimFrame(moveTransition);
									} else {
										// Due to speed, pixel calculus is not exact if character moves more than one pixel per frame
										bomberman.characters[i].position.x = auxCharacter.position.x;
										bomberman.characters[i].isMoving = false;

										if (bomberman.characters[i].keyOnStack !== null) {
											setPosition(bomberman.characters[i].keyOnStack, userId);
											bomberman.characters[i].keyOnStack = null;
										}
									}
									break;
								case keyCodes.down:
									bomberman.characters[i].position.y += speed;
									if (bomberman.characters[i].position.y < auxCharacter.position.y) {
										requestAnimFrame(moveTransition);
									} else {
										// Due to speed, pixel calculus is not exact if character moves more than one pixel per frame
										bomberman.characters[i].position.y = auxCharacter.position.y;
										bomberman.characters[i].isMoving = false;

										if (bomberman.characters[i].keyOnStack !== null) {
											setPosition(bomberman.characters[i].keyOnStack, userId);
											bomberman.characters[i].keyOnStack = null;
										}
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

		var checkCollisions = function(character) {
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