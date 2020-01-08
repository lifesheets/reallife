var Animations = require("../libs/animations.js");
var Interaction = require("../interaction");
var Vehicle = require("../models/vehicle.js").vehicle;
mp.events.addCommand("sveh", (player, fullText, ...args) => {
	let pos = player.position;
	let model = args[0];
	var veh = new Vehicle(player, 0, {
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