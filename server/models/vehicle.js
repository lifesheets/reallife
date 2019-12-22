var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var Appearance = require("./appearance.js");
var Interaction = require("../interaction");
var Vehicles = require("../database").vehicles;
class Vehicle extends EventEmitter {
	constructor(owner, id, data) {
		this.owner = owner;
		this.id = id;
		this.park_position = {
			x: 0,
			y: 0,
			z: 0,
			rx: 0,
			ry: 0,
			rz: 0
		}
		this.tuning = {};
		this.model = "";
		this.health = 500;
		this.armor = 1000;
		this.db_veh = undefined;
		this.vehicle = undefined;
		if (this.id != false) {
			this.load();
		} else {
			this.create(data);
		}
	}
	create(data) {
		Vehicles.create({
			"owner": this.owner.uID,
			"model": data.model,
			"x": data.x,
			"y": data.y,
			"z": data.z,
			"rx": data.rx,
			"ry": data.ry,
			"rz": data.rz,
			"data": ""
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
			this.db_veh = veh[0];
			// project will be the first entry of the Projects table with the title 'aProject' || null
			this.model = this.db_veh.model;
			this.park_position = {
				x: this.db_veh.x,
				y: this.db_veh.x,
				z: this.db_veh.x,
				rx: this.db_veh.rx,
				ry: this.db_veh.ry,
				rz: this.db_veh.rz
			};
			this.tuning = this.db_veh.data.get();
			this.spawn();
		})
	}
	spawn() {
		this.vehicle = mp.vehicles.new(mp.joaat(this.model), new mp.Vector3(this.park_position.x, this.park_position.y, this.park_position.z), {
			color: [
				[200, 150, 0],
				[200, 150, 0]
			],
			dimension: 0,
			engine: false,
			locked: true,
			heading: this.park_position.rz
		});
		this.vehicle.interface = this;
		this.vehicle.numberPlate = "TEST";



		this.tuning.forEach((tune) => {
			if(tune.type=="mod") {
				this.vehicle.setMod(parseInt(tune.type), parseInt(tune.index));
			}
			if (tune.type == "colorrgb") {
				this.vehicle.setColorRGB(tune.r1,tune.g1,tune.b1, tune.r2,tune.g2,tune.b2);
			}
			if (tune.type == "color") {
				this.vehicle.setColor(tune.first,tune.second);
			}
			if (tune.type == "neon") {
				this.vehicle.setNeonColor(tune.r,tune.g,tune.b);
			}
		})
		return this.vehicle;
	}
	respawn(){
		this.vehicle.destroy();
		return this.spawn();
	}
	park() {
		//TODO
	}
	reloadTunings() {
		//todo
	}
	toggleLock() {
		let newState = !this.vehicle.locked;
		this.vehicle.locked = newState;
	}
}
module.exports = Vehicle;