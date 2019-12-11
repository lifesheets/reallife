var natives = require("./natives.js")
var CEFInterface = require("./browser.js").interface;
var CEFNotification = require("./browser.js").notification;
var CEFHud = require("./browser.js").hud;
require("./maps/container.js");
require("./character_creator.js");
//CEFInterface.load("login/index.html");
//mp.defaultCam = mp.cameras.new('default', new mp.Vector3(749.273193359375, 1294.376708984375, 391.9619445800781), new mp.Vector3(), 70);
//mp.defaultCam.pointAtCoord(485.366455078125, -1569.3214111328125, 203.82797241210938);
//mp.defaultCam.setActive(true);
//mp.game.cam.renderScriptCams(true, false, 0, true, false);
mp.game.ui.displayHud(false);
mp.game.ui.displayRadar(false);
//mp.game.graphics.transitionToBlurred(1);
//mp.game.graphics.transitionFromBlurred(1);


mp.events.add('intro:start', () => {
	console.log("start intro");
	mp.players.local.position = new mp.Vector3(1240.9813232421875, -2998.3310546875, 12.331292152404785);

	mp.players.local.setAlpha(255);
	mp.players.local.freezePosition(true);
	mp.defaultCam = mp.cameras.new('default', new mp.Vector3(1242.775,-2998.0186,12.8503), new mp.Vector3(), 60);
	mp.defaultCam.pointAtCoord(1240.9813232421875, -2998.3310546875, 12.331292152404785);
	mp.defaultCam.setActive(true);
	mp.game.cam.renderScriptCams(true, false, 0, true, false);
	mp.game.graphics.transitionFromBlurred(1);



	CEFInterface.load("character_creator/index.html");
	CEFInterface.cursor(true);


	mp.events.call("Character:Edit",true);
	mp.players.local.setHeading(-90);

});