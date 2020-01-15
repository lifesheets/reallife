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
		this.owner = data.owner == undefined ? {
			id: -1
		} : data.owner;
		this.type = data.type;
		this.name = data.name
		this.shape_enter = mp.colshapes.newSphere(this.x, this.y, this.z, 1.2, 0);
		this.shape_leave = mp.colshapes.newSphere(this.px, this.py, this.pz, 1.2, this.dim);
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
		player.call("server:estate:enablemarker", [this.id, JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z,
			price: (this.owner.id == -1 ? this.price : 0),
			owner: (this.owner.id != -1 ? this.owner.name : ""),
			locked: this.locked,
			type:this.type,
			name:this.name || ""
		})]);
	}
	leaveView(player) {
		player.call("server:estate:disablemarker", [this.id]);
	}
	enterInteract(player) {
		console.log(this);
		console.log(player.interface.id);
		if (!this.entered_players[player.interface.id]) {
			player.call("server:interaction:request", [70, "Betreten", 500]);
			player.interface.once("interact", this.interact_event_enter_cache[player.interface.id] = key => {
				console.log("enter house");
				this.entered_players[player.interface.id] = true;
				player.outputChatBox(`rein`);
				player.position = new mp.Vector3(this.px, this.py, this.pz);
				player.dimension = this.dim;
			})
		}
		if (this.entered_players[player.interface.id]) {
			player.call("server:interaction:request", [70, "Verlassen", 500]);
			player.interface.once("interact", this.interact_event_leave_cache[player.interface.id] = key => {
				console.log("leave house");
				player.outputChatBox(`raus`);
				this.entered_players[player.interface.id] = false;
				player.position = new mp.Vector3(this.x, this.y, this.z);
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
// normal haus ( zum kaufen )
new House({
	id: 1,
	x: -61.74906539916992,
	y:-1118.4771728515625,
	z:26.431968688964844,
	px: 136.60789489746094,
	py: -1048.853271484375,
	pz: 57.79618835449219,
	locked: false,
	restrictions: {},
	interior: 0,
	dim: 150,
	price: 150000,
	owner: {
		id: -1
	},
	type:"house"
})

// öffentliches gebäude
new House({
	id: 2,
	x: -59.16584396362305,y:-1118.68603515625,z:26.432044982910156,
	px: 136.60789489746094,
	py: -1048.853271484375,
	pz: 57.79618835449219,
	locked: false,
	restrictions: {},
	interior: 0,
	dim: 115,
	type:"public",
	name:"Chaturbate Chamber"
})
// unternehmen gebäude
new House({
	id: 3,
	x: -56.3157844543457,y:-1118.0601806640625,z:26.43294334411621,
	px: 136.60789489746094,
	py: -1048.853271484375,
	pz: 57.79618835449219,
	locked: false,
	restrictions: {},
	interior: 0,
	dim: 116,
	type:"business",
	name:"Deluxe Motorsports"
})
// geschlossen haus
new House({
	id: 4,
	x: -53.390098571777344,y:-1118.302490234375,z:26.432538986206055,
	px: 136.60789489746094,
	py: -1048.853271484375,
	pz: 57.79618835449219,
	locked: true,
	restrictions: {},
	interior: 0,
	price: 150000,
	dim: 112,
	owner: {
		id: 1,
		name:"Z8pn"
	},
	type:"house"
})
// verkauft haus
new House({
	id: 5,
	x: -50.67021942138672,y:-1118.430419921875,z:26.432222366333008,
	px: 136.60789489746094,
	py: -1048.853271484375,
	pz: 57.79618835449219,
	locked: false,
	restrictions: {},
	interior: 0,
	price: 150000,
	dim: 111,
	owner: {
		id: 1,
		name:"Z8pn"
	},
	type:"house"
})



var HouseManager = new class {
	constructor() {
		this.houses = [];
		//this.load();
	}
}
module.exports = {
	mgr: HouseManager,
	house: House
};