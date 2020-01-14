"use strict";
var CEFHud = require("./browser.js").hud;
var getMinimapAnchor = require("./utils.js").minimap_anchor;
var keyQueue = [];
var isTachoVisible = false;
mp.cache["hud"] = true;
mp.cache["hud_cash"] = 0;
mp.cache["hud_hunger"] = 0;
mp.cache["hud_ready"] = false;
CEFHud.load("hud/index.html");
mp.events.add("cef:hud:ready", () => {
	mp.cache["hud_ready"] = true;
});
mp.events.addDataHandler("cash_hand", (entity, value, oldValue) => {
	if (entity != mp.players.local) return;
	if (mp.cache["hud_ready"]) {
		console.log("cash change");
		mp.cache["hud_cash"] = value;
		CEFHud.call("updateCash", mp.cache["hud_cash"]);
		CEFHud.call("addCashTransaction", (oldValue - value));
	}
});
mp.events.addDataHandler("hunger_val", (entity, value, oldValue) => {
	if (entity != mp.players.local) return;
	if (mp.cache["hud_ready"]) {
		if (mp.cache["hud_hunger"] != value) {
			mp.cache["hud_hunger"] = value;
			CEFHud.call("updateHunger", mp.cache["hud_hunger"]);
		}
	}
});
mp.events.add("render", () => {
	let res = mp.game.graphics.getScreenActiveResolution(0, 0);
	//console.log(res);
	if (mp.cache["hud_ready"]) {
		if ((mp.players.local.getVariable("spawned") == true) && (mp.players.local.getVariable("death") == false)) {
			if ((res.x != mp.cache["screen_x"]) || (res.y != mp.cache["screen_y"]) || mp.cache["hud"] == false) {
				console.log("init hud");
				CEFHud.call("init", getMinimapAnchor());
				mp.cache["hud"] = true;
				CEFHud.call("toggleHUD", true);
				CEFHud.call("updateCash", mp.players.local.getVariable('cash_hand'));
				CEFHud.call("updateHunger", mp.players.local.getVariable('hunger_val'));
			}
			mp.cache["screen_x"] = res.x;
			mp.cache["screen_y"] = res.y;
			//mp.cache["hud"]
		} else {
			CEFHud.call("toggleHUD", false);
			mp.cache["hud"] = false;
		}
	}
	if (mp.players.local.isInAnyVehicle(false)) {
		let speed = mp.players.local.vehicle.getSpeed() * 3.6;
		CEFHud.call("drawTacho", speed, 90, 180);
		isTachoVisible = true;
		return;
	};
	if (isTachoVisible) {
		CEFHud.call("clearTacho");
		isTachoVisible = false;
	}
	//-
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