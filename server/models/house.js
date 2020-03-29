var EventEmitter = require('events').EventEmitter;
var HouseDB = require("../database").property;
class House extends EventEmitter {
	constructor(id,x,y,z,px,py,pz,dim,interior,data) {
		super();
		let self = this;
		this.id = id;
		this.x = x;
		this.y = y;
		this.z = z;
		this.px = px;
		this.py = py;
		this.pz = pz;
		this.dim = dim;
		this.interior = interior;


		this.data = data;



		/*this.locked = data.locked;
		this.restríctions = data.restrictions;
		this.price = data.price;
		this.rent = 0;
		this.owner = data.owner == undefined ? {
			id: -1
		} : data.owner;*/








		this.entered_players = [];
		this.interact_event_enter_cache = [];
		this.interact_event_leave_cache = [];
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
		let string = `
		Haus\n`
		/*${this.data.locked ? 'Geschlossen\n' : 'Offen\n'}
		${this.data.owner.id == -1 ? "Preis:$"+this.data.price+"\n" : ""}
		${this.data.owner.id != -1 ? "Gehört:"+this.data.owner.name+"\n" : ""}*/

		let color = [255, 255, 255, 255];
		let text_color = [255, 255, 255, 255];
		player.call("server:world:enablemarker", [this.id, JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z,
			text: string,
			marker: 25,
			colorMarker: color,
			colorText: text_color,
			rotate: false,
			dollar: this.owner.id == -1,
			offset: 0.01,
			font: 5 // 4
		})]);
	}
	leaveView(player) {
		player.call("server:world:disablemarker", [this.id]);
	}
	enterInteract(player) {
		console.log(this);
		console.log(player.interface.id);
		if (!this.entered_players[player.interface.id]) {
			if (this.data.locked) return;
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
	isOwner(playerid){
		return this.data.owner.id == playerid;
	}
	isRentee(playerid) {
		return true;
	}
}
// normal haus ( zum kaufen )
/*
new House({
	id: 1,
	x: -61.74906539916992,
	y: -1118.4771728515625,
	z: 26.431968688964844,
	px: 136.60789489746094,
	py: -1048.853271484375,
	pz: 57.79618835449219,
	interior: 0,
	dim: 150,
	data:{
		locked:false,
		owner:-1,
		rentees:{}
	}
})*/

var HouseManager = new class {
	constructor() {
		this.houses_data = [];
		this.houses = [];
		this.load();
	}
	load() {
		HouseDB.findAll({}).then(houses => {
			console.log("houses", houses);
			//if (!vehs.length) return console.log("not enough vehs");
			this.houses_data = houses.map(e => {
				return {
					id: e.hid,
					x: e.x,
					y: e.y,
					z: e.z,
					px: e.px,
					py: e.py,
					pz: e.pz,
					dim: e.dim,
					interior: e.interior,
					data: JSON.parse(e.data)
				}
			});
			this.init();
		}).catch(err => {
			console.log("error fetching houses", err);
		})
		console.log("load houses");

	}
	init( ){
		if (this.houses.length == 0) return;

		this.houses_data.forEach((house) => {
			this.houses[house.id] = new House(house.id,house.x,house.y,house.z,house.px,house.py,house.pz,house.dim,house.interior,house.data)
		})
	}
}
module.exports = {
	mgr: HouseManager,
	house: House
};