var Animations = require("../libs/animations.js");
var Interaction = require("../interaction");
var Vehicle = require("../models/vehicle.js").vehicle;
mp.events.addCommand("r", (player, fullText, ...args) => {
	let veh = player.vehicle;
	console.log(veh);
	veh.interface.respawn();
});
mp.events.addCommand("park", (player, fullText, ...args) => {
	let veh = player.vehicle;
	console.log(veh);
	veh.interface.park();
});
mp.events.addCommand("tune", (player, fullText, ...args) => {
	let veh = player.vehicle;
	let r = parseInt(args[0]);
	let g = parseInt(args[1]);
	let b = parseInt(args[2]);
	console.log(r,g,b);
	veh.interface.setTune({
		"rgb": {
			r1: r,
			g1: g,
			b1: b,
			r2: r,
			g2: g,
			b2: b
		}
	});
	//console.log(veh);
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