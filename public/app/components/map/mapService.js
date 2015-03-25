'use strict';
/**
 * Map service. Creates the game map
 */
app.service('MapService', [
	'StageService',
	'RendererService',
	function(stage, renderer) {
		var map = this,
			stage = stage.stage,
			renderer = renderer.renderer,
			stoneTexture = PIXI.Texture.fromImage('assets/img/stoneBox.png'),
			woodTexture = PIXI.Texture.fromImage('assets/img/woodBox.gif'),
			grassTexture = PIXI.Texture.fromImage('assets/img/grass.png');

		map.boxes = {
			noBreakable: [],
			breakable: []
		};

		map.initMap = function() {
			// Creates the static stone boxes
			for (var j = 0; j < renderer.heightDivision - 1; j++) {
				if (j % 2 !== 0) {
					for (var i = 0; i < renderer.widthDivision - 1; i++) {
						if (i % 2 !== 0) {
							var box = createBox(j, i, stoneTexture, false);

							map.boxes.noBreakable.push(box);
							stage.addChild(box);
						}
					}
				}
			}
			
			// Creates the breakable boxes
			for (var j = 0; j < renderer.heightDivision - 1; j++) {
				for (var i = 0; i < renderer.widthDivision - 1; i++) {
					if ((i % 2 === 0 || j % 2 === 0) && 
							(j >= 1 && i >= 1) && 
							(j <= renderer.heightDivision - 3 && i <= renderer.widthDivision - 3)) {
						var box = createBox(j, i, woodTexture, true);

						map.boxes.breakable.push(box);
						stage.addChild(box);
					}
				}
			}			
		};
		
		var createBox = function(hIndex, wIndex, texture, breakable) {
			var box = new PIXI.Sprite(texture);

			box.anchor.x = 0;
			box.anchor.y = 0;
			box.position.x = wIndex * renderer.quadrantX;
			box.position.y = hIndex * renderer.quadrantY;
			box.width = renderer.quadrantX;
			box.height = renderer.quadrantY;
			box.breakable = breakable;	
			
			return box;
		};		
	}
]);