var EventEmitter = require('events').EventEmitter;
var Interaction = require("../interaction");
var eState = require("../database").estate;
class House extends EventEmitter {
	constructor(data) {
		super();
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
		this.interaction_shape_enter = new Interaction(this.x, this.y, this.z, 0, 2, this.enterInteract, this.leaveInteract);
		this.interaction_shape_leave = new Interaction(this.x, this.y, this.z, 0, 2, this.enterInteract, this.leaveInteract);
		this.view_shape = new Interaction(this.x, this.y, this.z, 0, 10, this.enterView, this.leaveView);
	}

	leaveView(player){
		player.call("server:estate:enablemarker", [{x:this.x,y:this.y,z:this.z}]);
	}
	enterView(player){
		player.call("server:estate:disablemarker");

	}



	enterInteract(player) {
		if (!this.entered_players[player]) {
			player.call("server:interaction:request", [70, "Betreten", 1000]);
			player.interface.once("interact", this.interact_event_enter_cache[player] = key => {
				console.log("enter house");
				player.outputChatBox(`rein`);
			})
		}
		if (this.entered_players[player]) {
			player.call("server:interaction:request", [70, "Verlassen", 1000]);
			player.interface.once("interact", this.interact_event_leave_cache[player] = key => {
				console.log("leave house");
				player.outputChatBox(`raus`);
			})
		}
	}
	leaveInteract(player) {
		if (this.interact_event_leave_cache[player] || this.interact_event_enter_cache[player]) player.call("server:interaction:cancelrequest", [70]);
		if (this.interact_event_leave_cache[player]) {
			player.interface.off("interact", this.interact_event_leave_cache[player])
			this.interact_event_leave_cache[player] = undefined;

		}
		if (this.interact_event_enter_cache[player]) {
			player.interface.off("interact", this.interact_event_enter_cache[player])
			this.interact_event_enter_cache[player] = undefined;
		}
	}
}

new House({
	id:1,
	x:-111.40582275390625,y:-1104.712158203125,z:25.79868507385254,
	px:136.60789489746094,py:-1048.853271484375,pz:57.79618835449219,
	locked:false,
	restrictions:{},
	interior:0,
	dim:0,
	price:150000,
	owner:false
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