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
			renderer = renderer.renderer;

		bomberman.characters = [];
		bomberman.characterIndex = null;

		bomberman.initListeners = function() {
			Socket.on('move', function(keyCode, userId) {
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

			return character;
		};
		
		var setPosition = function(key, userId) {
			var collision = false;

			for (var i = 0; i < bomberman.characters.length; i++) {
				if (bomberman.characters[i].userId === userId) {
					var auxCharacter = {
						width: bomberman.characters[i].width,
						height: bomberman.characters[i].height,
						position: {
							x: bomberman.characters[i].position.x,
							y: bomberman.characters[i].position.y,
						} 
					};

					// Applies the movement coordinate to the aux object
					switch (key) {
						case keyCodes.left:
							auxCharacter.position.x -= 1;
							break
						case keyCodes.up:
							auxCharacter.position.y -= 1;
							break;
						case keyCodes.right:
							auxCharacter.position.x += 1;
							break;
						case keyCodes.down:
							auxCharacter.position.y += 1;
							break;
					}	

					// Checks for collisions
					for (var j = 0; j < map.boxes.breakable.length; j++) {
						
						if (checkCollision(auxCharacter, map.boxes.breakable[j])) {
							collision = true;
						}
					}

					for (var j = 0; j < map.boxes.noBreakable.length; j++) {
						if (checkCollision(auxCharacter, map.boxes.noBreakable[j])) {
							collision = true;
						}
					}

					// No collision, movement to be applied
					if (!collision /*&& auxCharacter.position.x < 0 && auxCharacter.position.y < 0*/) {
						bomberman.characters[i].position.x = auxCharacter.position.x;
						bomberman.characters[i].position.y = auxCharacter.position.y;
					}

					break;
				}
			}
		};

		var checkCollision = function(sprite1, sprite2) {
			return !(sprite2.position.x >= (sprite1.position.x + sprite1.width)  || 
				(sprite2.position.x + sprite2.width ) <= sprite1.position.x || 
				sprite2.position.y >= (sprite1.position.y + sprite1.height) ||
				(sprite2.position.y + sprite2.height) <= sprite1.position.y);
	    };
	}
]);