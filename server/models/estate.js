var EventEmitter = require('events').EventEmitter;
var eState = require("../database").estate;
class House extends EventEmitter {
	constructor(data) {
		super();
		let self = this;
		this.id = data.id;
		this.x = data.x;
		this.y = data.y;
		this.z = data.z;
		this.px = data.px;
		this.py = data.py;
		this.pz = data.pz;
		this.dim = data.dim;
		this.interior = data.interior;
		this.locked = data.locked;
		this.restríctions = data.restrictions;
		this.entered_players = [];
		this.interact_event_enter_cache = [];
		this.interact_event_leave_cache = [];
		this.price = data.price;
		this.owner = data.owner;
		this.shape_enter = mp.colshapes.newSphere(this.x, this.y, this.z, 1, 0);
		this.shape_leave = mp.colshapes.newSphere(this.px, this.py, this.pz, 1, this.dim);
		this.view_shape = mp.colshapes.newSphere(this.x, this.y, this.z, 50, 0);
		this.enterEvent = new mp.Event('playerEnterColshape', (player, shape) => {
			if ((shape == this.shape_enter) || (shape == this.shape_leave)) {
				this.enterInteract(player);
			} else if (shape == this.view_shape) {
				this.enterView(player);
			}
		});
		this.leaveEvent = new mp.Event('playerExitColshape', (player, shape) => {
			if ((shape == this.shape_enter) || (shape == this.shape_leave)) {
				this.leaveInteract(player);
			} else if (shape == this.view_shape) {
				this.leaveView(player);
			}
		});
	}
	enterView(player) {
		player.call("server:estate:enablemarker", [JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z
		})]);
	}
	leaveView(player) {
		player.call("server:estate:disablemarker");
	}
	enterInteract(player) {
		console.log(this);
		console.log(player.interface.id);
		if (!this.entered_players[player.interface.id]) {
			player.call("server:interaction:request", [70, "Betreten", 1500]);
			player.interface.once("interact", this.interact_event_enter_cache[player.interface.id] = key => {
				console.log("enter house");
				this.entered_players[player.interface.id] = true;
				player.outputChatBox(`rein`);
				player.position = new mp.Vector3(this.px,this.py,this.pz);
				player.dimension = this.dim;
			})
		}
		if (this.entered_players[player.interface.id]) {
			player.call("server:interaction:request", [70, "Verlassen", 1500]);
			player.interface.once("interact", this.interact_event_leave_cache[player.interface.id] = key => {
				console.log("leave house");
				player.outputChatBox(`raus`);
				this.entered_players[player.interface.id] = false;
				player.position = new mp.Vector3(this.x,this.y,this.z);
				player.dimension = 0;
			})
		}
	}
	leaveInteract(player) {
		if (this.interact_event_leave_cache[player.interface.id] || this.interact_event_enter_cache[player.interface.id]) player.call("server:interaction:cancelrequest", [70]);
		if (this.interact_event_leave_cache[player.interface.id]) {
			player.interface.off("interact", this.interact_event_leave_cache[player.interface.id])
			this.interact_event_leave_cache[player.interface.id] = undefined;
		}
		if (this.interact_event_enter_cache[player.interface.id]) {
			player.interface.off("interact", this.interact_event_enter_cache[player.interface.id])
			this.interact_event_enter_cache[player.interface.id] = undefined;
		}
	}
}
new House({
	id: 1,
	x: -61.08648681640625,y:-1093.569580078125,z:26.494855880737305,
	px: 136.60789489746094,
	py: -1048.853271484375,
	pz: 57.79618835449219,
	locked: false,
	restrictions: {},
	interior: 0,
	dim: 0,
	price: 150000,
	owner: false
})
var HouseManager = new class {
	constructor() {
		this.houses = [];
	}
}
module.exports = {
	mgr: HouseManager,
	house: House
};