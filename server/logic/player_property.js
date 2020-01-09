var Animations = require("../libs/animations.js");
var Interaction = require("../interaction");
var Vehicle = require("../models/vehicle/vehicle.js").vehicle;
mp.events.addCommand("r", (player, fullText, ...args) => {
	let veh = player.vehicle;
	console.log(veh);
	veh.interface.respawn();
});
mp.events.addCommand("rgb", (player, fullText, ...args) => {
	let veh = player.vehicle;
	let [r, g, b] = args
	veh.interface.setTune = {
		"rgb": {
			r: 255,
			g: 100,
			b: 200
		}
	};
	console.log(veh);
	veh.interface.reloadTunings();
	//veh.interface.respawn();
});
mp.events.addCommand("veh", (player, fullText, ...args) => {
	let pos = player.position;
	let model = args[0];
	var veh = new Vehicle(player, null, {
		"model": model,
		"x": pos.x,
		"y": pos.y,
		"z": pos.z,
		"rx": 0,
		"ry": 0,
		"rz": 0
	})
	console.log(veh);
});