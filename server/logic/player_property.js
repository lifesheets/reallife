var Animations = require("../libs/animations.js");
var Interaction = require("../interaction");
var Vehicle = require("../models/vehicle.js").vehicle;
var WebHooks = require('node-webhooks')
var webHooks = new WebHooks({
	db: './webHooksDB.json', // json file that store webhook URLs
	httpSuccessCodes: [200, 201, 202, 203, 204], //optional success http status codes
})
webHooks.add('commentDiscord', 'https://discordapp.com/api/webhooks/665736383800934430/2_ONewkeF0jvuruepC8C_RqZwv9Wb9gz1DJsa6zLgF4jS3dPB5PRr7JxCH4ASAo1IpB5').then(function() {
	console.log("added webhook")
}).catch(function(err) {
	console.log(err)
});
mp.events.addCommand("cash", (player, fullText, ...args) => {
	let cash = args[0];
	player.interface.money = parseInt(cash);
});
mp.events.addCommand("hunger", (player, fullText, ...args) => {
	let hunger = args[0];
	player.interface.hunger = parseInt(hunger);
});
mp.events.addCommand("p", (player, fullText, ...args) => {
	let name = args[0];
	let pos = player.position;
	webHooks.trigger('commentDiscord', {
		"content": "[" + name + "] " + pos.x + "," + pos.y + "," + pos.z,
		"username": "Position Hoe"
	})
});
mp.events.addCommand("r", (player, fullText, ...args) => {
	let veh = player.vehicle;
	console.log(veh);
	veh.interface.respawn();
});
mp.events.addCommand("park", (player, fullText, ...args) => {
	let veh = player.vehicle;
	console.log(veh);
	veh.interface.park();
	veh.interface.save();
});
mp.events.addCommand("rgb", (player, fullText, ...args) => {
	let veh = player.vehicle;
	let r = parseInt(args[0]);
	let g = parseInt(args[1]);
	let b = parseInt(args[2]);
	console.log(r, g, b);
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
	veh.interface.reloadTunings();
	veh.interface.save();
});

mp.events.addCommand("color", (player, fullText, ...args) => {
	let veh = player.vehicle;
	let f = parseInt(args[0]);
	let s = parseInt(args[1]);
	console.log(f,s);
	veh.interface.setTune({
		"color": {
			first:f,
			second:s
		}
	});
	veh.interface.reloadTunings();
	veh.interface.save();
});


mp.events.addCommand("neon", (player, fullText, ...args) => {
	let veh = player.vehicle;
	let r = parseInt(args[0]);
	let g = parseInt(args[1]);
	let b = parseInt(args[2]);
	console.log(r, g, b);
	veh.interface.setTune({
		"neon": {
			r:r,
			g:g,
			b:b
		}
	});
	veh.interface.reloadTunings();
	veh.interface.save();
});
mp.events.addCommand("tune", (player, fullText, ...args) => {
	let veh = player.vehicle;
	let type = parseInt(args[0]);
	let index = parseInt(args[1]);
	console.log(type,index);
	veh.interface.setTune({
		[`mod_${type}`]: {
			type:type,
			index:index
		}
	});
	veh.interface.reloadTunings();
	veh.interface.save();
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
	console.log("create veh");
});