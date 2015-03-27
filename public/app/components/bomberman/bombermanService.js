'use strict';
/**
 * Bomberman service
 */
app.service('BombermanService', [
	'HandshakeService',
	'StageService',
	'RendererService',
	'MovementService',
	'BombService',
	function(handshake, stage, renderer, movement, bomb) {
		var bomberman = this,
			keyCodes = {
				left: 37, // Left arrow
				up: 38, // Up arrow
				right: 39, // Right arrow
				down: 40, // Down arrow
				bomb: 90 // Z character
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
				for (var i = 0; i < bomberman.characters.length; i++) {
					if (bomberman.characters[i].isMoving && bomberman.characters[i].userId === userId) {
						bomberman.characters[i].keyOnStack = keyCode;
					} else {
						bomberman.characters[i].keyOnStack = null;
					}
				}

				movement.setPosition(bomberman, keyCode, userId);
			});

			Socket.on('bomb', function(userId) {
				for (var i = 0; i < bomberman.characters.length; i++) {
					if (bomberman.characters[i].userId === userId) {
						bomb.setBomb(bomberman.characters[i]);
					}
				}
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
				case keyCodes.bomb:
					Socket.emit('leaveBomb', handshake.userId);
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
	}
]);