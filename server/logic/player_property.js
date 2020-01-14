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
});
mp.events.addCommand("tune", (player, fullText, ...args) => {
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
	//console.log(veh);
	veh.interface.reloadTunings();
	//veh.interface.respawn() ;
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