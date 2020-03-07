var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var Appearance = require("./appearance.js");
var Interaction = require("../interaction");
var Vehicles = require("../database").vehicle;
var getKeyID = require("../libs/utils.js").getKeyID;
var iClass = require("../libs/items.js").classes;
var items = require("../libs/items.js").items;
var dirt_mul = (30 * 1000) / 15;
var veh_index = [];



var WorldVehicles = new class {
	constructor( ){
		this._vehicles = [];
	}
	has(key_id) {
		return this._vehicles.find(e => {
			return e.key == key_id;
		})
	}
	add(key_id = null,id = null, data) {
		let veh = new Vehicle(key_id ,id , data);
		this._vehicles.push(veh)
		return veh;
	}
	register(vehicle) {
		this._vehicles.push(vehicle)
	}
	remove(){

	}
}









class Vehicle extends EventEmitter {
	constructor(key_id = null,id = null, data) {
		super();
		this.id = id;
		this.key_id = key_id;
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
		WorldVehicles.register(this);
	}
	get key() {
		return this.key_id;
	}
	setTune(data) {
		this._tuning = Object.assign(this._tuning, data);
	}
	create(data) {
		Vehicles.create({
			"key_id": getKeyID.next().value,
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
			this.key_id = this.db_veh.key_id;
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
			//this.kmTravel = this.db_veh.kmTravel;
			//this.kmClean = this.db_veh.kmClean;
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
		this.vehicle.numberPlate = this.key_id;
		//console.log("spawn set dirt to", (this.kmClean / dirt_mul))
		//this.vehicle.setVariable("dirt_level", (this.kmClean / dirt_mul))
		this.vehicle.setVariable("uid", this.id)
		this.vehicle.setVariable("key_id", this.key_id)




		veh_index[this.id] = this;


		this.loadTunes();
		console.log("spawn", this.vehicle.position);
		this.emit("created");
		return this.vehicle;
	}
	fuel() {
		//this._lastKM = 0;
		//kmTravel

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
		this.db_veh.save().then(() => {
			console.log("saved veh");
		}).catch(err => {
			console.log("err saving", err);
		})
		//this._tuning = this.db_veh.data ? JSON.parse(this.db_veh.data) : {};
	}
	update() {}
	toggleLock() {
		let newState = !this.vehicle.locked;
		this.vehicle.locked = newState;
	}
	toggleEngine() {
		let newState = !this.vehicle.engine;
		this.vehicle.engine = newState;

		this.vehicle.setVariable("vehicle:engine:status", this.vehicle.engine)

		//vehicle:engine:status
	}
}
mp.events.add("client:vehicle:update", (player, dist) => {
	console.log("client:vehicle:update", player.name, dist);
	let pVeh = player.vehicle;
	if (pVeh.interface) {
		console.log("has interface");
		pVeh.interface.kmTravel += dist;
		pVeh.interface.kmClean += dist;
		let dirt_level = (pVeh.interface.kmClean / dirt_mul) > 15 ? 15 : (pVeh.interface.kmClean / dirt_mul);
		console.log("dirt level", dirt_level);
		pVeh.setVariable("dirt_level", dirt_level)
	}
});
mp.events.add("client:vehicle:engine", (player) => {
	console.log("client:vehicle:engine", player.name);
	// seat player.seat;
	//let veh_index = veh_index[this.id]
	let pVeh = player.vehicle;
	console.log("pVeh",pVeh);
	if (pVeh.interface) {
		console.log("has interface");
		pVeh.interface.toggleEngine();
	} else {

		let newState = !pVeh.engine;
		pVeh.engine = newState;
		pVeh.setVariable("vehicle:engine:status", pVeh.engine)
	}
});
mp.events.add("vehicle:seatbelt:toggle", (player) => {
	console.log("vehicle:seatbelt:toggle", player.name);
	player.setVariable("vehicle:seatbelt:status",!player.getVariable("vehicle:seatbelt:status"))
});


class VehicleManager {
	constructor(parent) {
		this.parent = parent;
		this.player = parent.player;
		this.loadedVehs = [];
		this.vehicles = [];



		/* Laod when Inventory is there*/
		this.parent.inventory.once("server:inventory:load",() => {
			console.log("server:inventory:load")
			this.load();
		})
		this._keys = [];
	}
	set keys(keys) {
		this._keys = keys;
	}
	load() {
		if (!this.parent.account.loggedIn) return;
		if (!this.parent.inventory.loaded) return;
		console.log("VehicleManager load");
		if (this.player != undefined) {
			let key = this.parent.inventory.getItemByID(items.KEY_VEHICLE)
			if (!key) return new Error("key not defined");
			this._keys = key.subItems.map(e => {
				return e.key_id;
			})

			console.log("this._keys",this._keys);
		}



		/*Vehicles.findAll({
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
		})*/
		console.log("TODO load veh with keys");
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