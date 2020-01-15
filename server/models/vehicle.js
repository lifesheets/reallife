var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var Appearance = require("./appearance.js");
var Interaction = require("../interaction");
var Vehicles = require("../database").vehicle;


var dirt_mul = 1000 / 15;

class Vehicle extends EventEmitter {
	constructor(owner, id, data) {
		super();
		this.owner = owner;
		this.id = id;
		this.park_position = {
			x: 0,
			y: 0,
			z: 0,
			rx: 0,
			ry: 0,
			rz: 0
		};
		this.kmTravel = 0;
		this.kmClean = 0;
		this._tuning = {};
		this.model = "";
		this.health = 500;
		this.armor = 1000;
		this.db_veh = undefined;
		this.vehicle = undefined;
		if (this.id != null) {
			this.load();
		} else {
			this.create(data);
		}
	}
	setTune(data) {
		this._tuning = Object.assign(this._tuning, data);
	}
	create(data) {
		Vehicles.create({
			"owner": this.owner.interface.id,
			"model": data.model,
			"x": data.x,
			"y": data.y,
			"z": data.z,
			"rx": data.rx,
			"ry": data.ry,
			"rz": data.rz,
			"data": JSON.stringify({})
		}).then((mVeh) => {
			this.id = mVeh.id;
			this.load();
		})
	}
	load() {
		Vehicles.findOne({
			where: {
				id: this.id
			}
		}).then(veh => {
			console.log(veh.dataValues);
			this.db_veh = veh;
			this.model = this.db_veh.model;
			this.park_position = {
				x: this.db_veh.x,
				y: this.db_veh.y,
				z: this.db_veh.z,
				rx: this.db_veh.rx,
				ry: this.db_veh.ry,
				rz: this.db_veh.rz
			};
			this._tuning = this.db_veh.data ? JSON.parse(this.db_veh.data) : {};


//this.player.setVariable("hunger_val", val);
			this.kmTravel = this.db_veh.kmTravel;
			this.kmClean = this.db_veh.kmClean;

			console.log(this._tuning);
			this.spawn();
		})
	}
	spawn() {
		this.vehicle = mp.vehicles.new(mp.joaat(this.model), new mp.Vector3(this.park_position.x, this.park_position.y, this.park_position.z), {
			color: [
				[0, 0, 0],
				[0, 0, 0]
			],
			dimension: 0,
			engine: false,
			locked: false,
			heading: this.park_position.rz
		});
		this.vehicle.interface = this;
		this.vehicle.numberPlate = "TEST";
		console.log("spawn set dirt to",(this.kmClean / dirt_mul))
		this.vehicle.setVariable("dirt_level", (this.kmClean / dirt_mul))
		this.loadTunes();
		console.log("spawn", this.vehicle.position);
		return this.vehicle;
	}
	respawn() {
		this.vehicle.destroy();
		this.vehicle = undefined;
		return this.spawn();
	}
	park() {
		//TODO
		this.park_position = {
			x: parseFloat(this.vehicle.position.x),
			y: parseFloat(this.vehicle.position.y),
			z: parseFloat(this.vehicle.position.z),
			rx: parseFloat(this.vehicle.rotation.x),
			ry: parseFloat(this.vehicle.rotation.y),
			rz: parseFloat(this.vehicle.rotation.z)
		};
	}
	loadTunes() {
		if (!this.vehicle) return;
		Object.keys(this._tuning).forEach((name) => {
			let tune = this._tuning[name];
			console.log("tune", tune);
			console.log("name", name);
			if (name.indexOf("mod") > -1) {
				this.vehicle.setMod(parseInt(tune.type), parseInt(tune.index));
			}
			if (name == "rgb") {
				this.vehicle.setColorRGB(tune.r1, tune.g1, tune.b1, tune.r2, tune.g2, tune.b2);
			}
			if (name == "color") {
				this.vehicle.setColor(tune.first, tune.second);
			}
			if (name == "neon") {
				this.vehicle.setNeonColor(tune.r, tune.g, tune.b);
			}
		})
	}
	deleteTunes() {
		if (!this.vehicle) return;
		for (var i = 0; i < 50; i++) {
			let s = this.vehicle.getMod(i);
			if (s == -1) continue;
			this.vehicle.setMod(i, -1);
		}
	}
	reloadTunings() {
		this.deleteTunes();
		this.loadTunes();
		//todo
	}
	save() {
		this.db_veh.x = this.park_position.x;
		this.db_veh.y = this.park_position.y;
		this.db_veh.z = this.park_position.z;
		this.db_veh.rx = this.park_position.rx;
		this.db_veh.ry = this.park_position.ry;
		this.db_veh.rz = this.park_position.rz;
		this.db_veh.data = JSON.stringify(this._tuning);
		this.db_veh.save().then( () => {
			console.log("saved veh");
		}).catch(err => {
			console.log("err saving",err);
		})
		//this._tuning = this.db_veh.data ? JSON.parse(this.db_veh.data) : {};
	}
	update() {


	}
	toggleLock() {
		let newState = !this.vehicle.locked;
		this.vehicle.locked = newState;
	}
}

mp.events.add("client:vehicle:update", (player,dist) => {
	console.log("client:vehicle:update", player.name,dist);
	//if (player.interface) {
	//	player.interface.death(reason, killer, true);
	//}
	let pVeh = player.vehicle;
	if (pVeh.interface) {
		console.log("has interface");

		pVeh.interface.kmTravel += dist;
		pVeh.interface.kmClean += dist;

		let dirt_level = (pVeh.interface.kmClean / dirt_mul) > 15 ? 15 : (pVeh.interface.kmClean / dirt_mul) ;
		console.log("dirT level",dirt_level);
		pVeh.setVariable("dirt_level", dirt_level)
	}





});


class VehicleManager {
	constructor(parent) {
		this.parent = parent;
		this.player = parent.player;
		this.loadedVehs = [];
		this.vehicles = [];
	}
	load() {
		if (!this.parent.account.loggedIn) return;
		Vehicles.findAll({
			where: {
				owner: this.parent.id
			}
		}).then(vehs => {
			console.log("vehs", vehs);
			//if (!vehs.length) return console.log("not enough vehs");
			this.vehicles = vehs.map(e => {
				return {
					id: e.id,
					owner: e.owner,
					model: e.model,
					x: e.x,
					y: e.y,
					z: e.z,
					rx: e.rx,
					ry: e.ry,
					rz: e.rz,
					data: e.data
				}
			});
			console.log("this.vehicles", this.vehicles);
			this.spawnAll();
		}).catch(err => {
			console.log("error fetching vehs", err);
		})
		console.log("load veh");
	}
	spawnAll() {
		console.log("spawn all");
		this.vehicles.forEach(v => {
			this.loadedVehs.push(new Vehicle(this.player, v.id, v));
		})
	}
}
module.exports = {
	mgr: VehicleManager,
	vehicle: Vehicle
};