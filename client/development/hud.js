"use strict";
var CEFHud = require("./browser.js").hud;
CEFHud.load("hud/index.html");
var keyQueue = [];

var isTachoVisible = false;
mp.events.add("render", () => {
	if (mp.players.local.isInAnyVehicle(false)) {
		let speed = mp.players.local.vehicle.getSpeed() * 3.6;

		CEFHud.call("drawTacho",speed,90,180);
		isTachoVisible = true;
		return;
	};
	if (isTachoVisible) {
		CEFHud.call("clearTacho");
		isTachoVisible = false;
	}





	//let rel_2d = mp.game.graphics.world3dToScreen2d(pos);
	//console.log(rel_2d);
	//CEFHud.call("drawInteraction", 69, "Selbstmord", 0.5, 0.9, 1000, 1)
	//CEFHud.call("drawInteraction", 70, "Tür aufhebeln", 0.5, 0.8, 1000, 1)
	//CEFHud.call("drawInteraction", 70, "Tür aufhebeln", 0.5, 0.8, 1000, 1)
	let row = 0;
	Object.keys(keyQueue).forEach((key) => {
		let req = keyQueue[key.toString()];
		if (req !== undefined) {
			row += 1;
			let x = req.x || 0.5;
			let y = req.y || 1.0 - (0.2 * row);
			//CEFHud.call("drawInteraction", 70, "Tür aufhebeln", 0.5, 0.8, 1000, 1)
			CEFHud.call("drawInteraction", req.key, req.string, x, y, req.duration, 1)
			//console.log( "drawInteraction", req.key, req.string, x, y, req.duration, 1)
		}
	})
});
mp.events.add("cef:interaction:receive", (key) => {
	//console.log(keyQueue[key]);
	if (keyQueue[key.toString()]) {
		console.log("interaction:receive", key);
		keyQueue[key.toString()] = undefined;
		mp.events.callRemote("client:interaction:receive", key);
	}
	console.log(keyQueue[key.toString()]);
});
mp.events.add("server:interaction:cancelrequest", (key) => {
	if (keyQueue[key.toString()]) {
		keyQueue[key.toString()] = undefined;
		CEFHud.call("cancelInteraction", key)
	}
});
mp.events.add("server:interaction:request", (key, string, duration, x = 0, y = 0) => {
	if (!keyQueue[key]) {
		CEFHud.call("killInteraction", key)
		console.log(key, string, duration, x, y);
		keyQueue[key.toString()] = {
			key: key,
			string: string,
			duration: duration,
			x: x,
			y: y
		}
	}
});
mp.keys.bind(0x71, false, function() {
	mp.events.call("server:interaction:request", 70, "Tasche durchsuchen", 1)
});