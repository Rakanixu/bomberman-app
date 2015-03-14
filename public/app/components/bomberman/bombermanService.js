'use strict';
/**
 * Bomberman service
 */
app.service('BombermanService', [
	'$rootScope',
	'HandshakeService',
	'CameraService',
	'SceneService',
	function($rootScope, handshake, camera, scene) {
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
			camera = camera.camera,
			scene = scene.scene;

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
				bomberman.characters.push(createCharacter(handshake.party[i]));
				
				if (bomberman.characters[i].userId === handshake.userId) {
					bomberman.characterIndex = i;
				}
			}

			for (var i = 0; i < bomberman.characters.length; i++) {
				scene.add(bomberman.characters[i]);
			}
		};

		var createCharacter = function(partyPlayerInfo) {
		    var head = new THREE.SphereGeometry(24, 6, 6),
	            hand = new THREE.SphereGeometry(6, 3, 3),
	            foot = new THREE.SphereGeometry(12, 3, 3, 0, Math.PI * 2, 0, Math.PI / 2),
	            nose = new THREE.SphereGeometry(3, 3, 3),
	            material = new THREE.MeshBasicMaterial({color: partyPlayerInfo.colour}),//new THREE.MeshLambertMaterial(args);
				character = new THREE.Object3D(),
				head = new THREE.Mesh(head, material),
				nose = new THREE.Mesh(nose, material),
				hands = {
					left: new THREE.Mesh(hand, material),
					right: new THREE.Mesh(hand, material)
				},
				feet = {
					left: new THREE.Mesh(foot, material),
					right: new THREE.Mesh(foot, material)
				};


			head.position.y = 0;
			character.add(head);
			hands.left.position.x = -30;
			hands.left.position.y = -6;
			hands.right.position.x = 30;
			hands.right.position.y = -6;
			character.add(hands.left);
			character.add(hands.right);
			feet.left.position.x = -15;
			feet.left.position.y = -36;
			feet.left.rotation.y = Math.PI / 4;
			feet.right.position.x = 15;
			feet.right.position.y = -36;
			feet.right.rotation.y = Math.PI / 4;
			character.add(feet.left);
			character.add(feet.right);
			nose.position.y = 0;
			nose.position.z = 24;
			character.add(nose);

			switch (partyPlayerInfo.screenLocation) {
				case screenLocation.leftTop: 
					character.position.x = -((camera.visibleWidth / 2) - camera.quadrantX);
					character.position.y = (camera.visibleHeight / 2) - camera.quadrantY;
					break;
				case screenLocation.rightTop:
					character.position.x = (camera.visibleWidth / 2) - camera.quadrantX;
					character.position.y = (camera.visibleHeight / 2) - camera.quadrantY;
					break;
				case screenLocation.leftBottom:
					character.position.x = -((camera.visibleWidth / 2) - camera.quadrantX);
					character.position.y = -((camera.visibleHeight / 2) - camera.quadrantY);
					break;
				case screenLocation.rightBottom:
					character.position.x = (camera.visibleWidth / 2) - camera.quadrantX;
					character.position.y = -((camera.visibleHeight / 2) - camera.quadrantY);
					break;
			}

			character.userId = partyPlayerInfo.userId;

			return character;
		};
		
		var setPosition = function(key, userId) {
			for (var i = 0; i < bomberman.characters.length; i++) {
				if (bomberman.characters[i].userId === userId) {
					switch (key) {
						case keyCodes.left:
							bomberman.characters[i].position.x -= camera.quadrantX;
							break
						case keyCodes.up:
							bomberman.characters[i].position.y += camera.quadrantY;
							break;
						case keyCodes.right:
							bomberman.characters[i].position.x += camera.quadrantX;
							break;
						case keyCodes.down:
							bomberman.characters[i].position.y -= camera.quadrantY;
							break;
					}
					
					break;
				}
			}
		};
	}
]);