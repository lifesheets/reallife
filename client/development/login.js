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
//mp.game.graphics.transitionToBlurred(1);
//mp.game.graphics.transitionFromBlurred(1);
let time = 0;
mp.keys.bind(0x72, false, function() {
	mp.game.time.setClockTime(time, 0, 0);
	if (time == 12) {
		time = 0;
	} else {
		time = 12;
	}
});
mp.gui.chat.activate(false);
mp.gui.chat.show(true);
mp.game.ui.displayHud(false);
mp.game.ui.displayRadar(false);
mp.events.add('cef:account:login', (username, password) => {
	if (mp.loggedIn) return;
	console.log(username, password)
	mp.events.callRemote("client:account:login", username, password);
});
mp.events.add('cef:account:register', (username, password, email) => {
	if (mp.loggedIn) return;
	console.log(username, password)
	mp.events.callRemote("client:account:register", username, password, email);
});
mp.events.add('server:account:init', () => {
	console.log("Login start");
	// cam pos 73.37151336669922, -3461.402587890625, 34.95772933959961
	// cam to pos 109.21778869628906, -3332.524169921875, 31.724140167236328
	mp.players.local.position = new mp.Vector3(73.37151336669922, -3461.402587890625, 32.95772933959961);
	mp.players.local.setAlpha(255);
	mp.players.local.freezePosition(true);
	mp.defaultCam = mp.cameras.new('default', new mp.Vector3(73.37151336669922, -3461.402587890625, 34.95772933959961), new mp.Vector3(), 60);
	mp.defaultCam.pointAtCoord(109.21778869628906, -3332.524169921875, 31.724140167236328);
	mp.defaultCam.setActive(true);
	mp.game.cam.renderScriptCams(true, false, 0, true, false);
	CEFInterface.load("login/index.html");
	CEFInterface.cursor(true);
});
mp.events.add('server:intro:start', () => {
	console.log("start intro");
	CEFInterface.load("empty.html");
	mp.players.local.position = new mp.Vector3(-133.6523895263672, -2378.825439453125, 15.16739273071289);
	mp.players.local.setAlpha(255);
	mp.players.local.freezePosition(true);
	mp.game.cam.doScreenFadeOut(1000);
	setTimeout(() => {
		mp.game.cam.doScreenFadeIn(100);
		mp.defaultCam = mp.cameras.new('default', new mp.Vector3(-133.93670654296875, -2376.887939453125, 15.57387962341309), new mp.Vector3(), 60);
		mp.defaultCam.pointAtCoord(-133.6523895263672, -2378.825439453125, 15.16739273071289);
		mp.defaultCam.setActive(true);
		mp.game.cam.renderScriptCams(true, false, 0, true, false);
		mp.game.graphics.transitionFromBlurred(1);
		CEFInterface.load("character_creator/index.html");
		CEFInterface.cursor(true);
		mp.events.call("cef:character:edit", true);
		mp.players.local.setHeading(0);
	}, 3000);
});
mp.events.add('server:game:start', () => {
	mp.game.cam.doScreenFadeIn(100);
	mp.defaultCam.setActive(false);
	mp.players.local.freezePosition(false);
	//mp.game.cam.doScreenFadeOut(500);
	mp.game.ui.displayHud(true);
	mp.game.ui.displayRadar(true);
	mp.game.cam.renderScriptCams(false, false, 0, true, false);
	CEFInterface.load("empty.html");
	CEFInterface.cursor(false);
});