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
		this.color = {
			primary: {
				r: 0,
				g: 0,
				b: 0
			},
			secondary: {
				r: 0,
				g: 0,
				b: 0
			}
		}
		this.tuning = {};
		this.model = "";
		this.health = 500;
		this.armor = 1000;
		this.db_veh = undefined;
		if (this.id != false) {
			this.load();
		} else {
			this.create(data);
		}
	}
	create(data) {
		Vehicles.create({
			"owner":this.owner.uID,
			"model":data.model,
			"x":data.x,
			"y":data.y,
			"z":data.z,
			"rx":data.rx,
			"ry":data.ry,
			"rz":data.rz,
			"data":""
		}).then((mVeh) =>{
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
		})
	}
}