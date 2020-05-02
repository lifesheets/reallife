var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var Appearance = require("./appearance.js");
var Interaction = require("../interaction");
var Vehicles = require("../database").vehicle;
var getKeyID = require("../libs/utils.js").getKeyID;
var iClass = require("../libs/items.js").classes;
var items = require("../libs/items.js").items;
var e = require("../libs/items.js");
var dirt_mul = (30 * 1000) / 15;
var veh_index = [];
var WorldVehicles = new class {
    constructor() {
        this._vehicles = [];
    }
    register(vehicle) {
        this._vehicles.push(vehicle)
    }
    remove() {}
}
class Vehicle extends EventEmitter {
    //  v.db,undefined,this.type
    constructor(db_handle, data, worldType = TYPE.PLAYER) {
        super();
        this.db = db_handle;
        this.park_position = {
            x: 0,
            y: 0,
            z: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };
        this.health = 500;
        this.armor = 1000;
        this.vehicle = undefined;
        this.worldType = worldType;
        this.lightState = false;
        this.lightMul = 1;
        if (this.db != undefined) {
            this.load();
        } else {
            this.create(data);
        }
        WorldVehicles.register(this);
    }
    get model() {
        if (!this.db) return new Error("No Model for Veh");
        return this.db.model_id
    }
    set model(e) {
        if (!this.db) return new Error("No Model for Veh");
        console.log("SET MODEL ID", e);
        this.db.model_id = e;
    }
    get data() {
        let f = JSON.parse(this.db.data || JSON.stringify({}));
        return f;
    }
    set data(d) {
        console.log("d", d)
        this.db.data = JSON.stringifyIfObject(d);
    }
    get id() {
        if (!this.db) return new Error("No DB Handle for Veh");
        return this.db.vid;
    }
    set id(e) {
        if (!this.db) return new Error("No DB Handle for Veh");
        if (this.db) return new Error("DO NOT SET ID FOR EXISTING DBVEH")
        this.db.vid = e;
    }
    get owner() {
        return this.worldType;
    }
    get key() {
        return this.key_id;
    }
    get tuning() {
        if (!this.db) return new Error("No db for Veh");
        return JSON.parse(this.db.tuning || JSON.stringify({}));
    }
    set tuning(e) {
        if (!this.db) return new Error("No db for Veh");
        this.db.tuning = JSON.stringify(e);
    }
    get fuel() {
        if (!this.db) return new Error("No db for Veh");
        return this.data.fuel;
    }
    set fuel(e) {
        if (!this.db) return new Error("No db for Veh");
        this.data.fuel = e;
    }
    init() {
        // this.id = this.db.vid;
        console.log("this.db.model_id", this.db.model_id);
        // this.model = this.db.model_id;
        this.park_position = {
            x: this.db.pos_x,
            y: this.db.pos_y,
            z: this.db.pos_z,
            rx: this.db.rot_rx,
            ry: this.db.rot_ry,
            rz: this.db.rot_rz
        };
        //this.player.setVariable("hunger_val", val);
        //this.kmTravel = this.db.kmTravel;
        //this.kmClean = this.db.kmClean;
        console.log("this.tuning", this.tuning);
        this.spawn();
    }
    create(data) {
        Vehicles.create({
            "model_id": data.model_id,
            "pos_x": data.pos_x,
            "pos_y": data.pos_y,
            "pos_z": data.pos_z,
            "rot_rx": data.rot_rx,
            "rot_ry": data.rot_ry,
            "rot_rz": data.rot_rz,
            "tuning": JSON.stringify({}),
            "data": JSON.stringify({})
        }).then((mVeh) => {
            this.id = mVeh.id;
            this.db = mVeh.db;
            this.init();
        })
    }
    tune(data) {
        this.tuning = Object.assign(this.tuning, data);
    }
    load() {
        if (!this.db) {
            Vehicles.findOne({
                where: {
                    vid: this.id
                }
            }).then(veh => {
                this.id = veh.vid;
                this.db = veh;
                return this.init();
            })
        }
        return this.init();
    }
    spawn() {
        this.vehicle = mp.vehicles.new(this.model, new mp.Vector3(this.park_position.x, this.park_position.y, this.park_position.z), {
            color: [
                [0, 0, 0],
                [0, 0, 0]
            ],
            dimension: 0,
            engine: false,
            locked: false,
            heading: this.park_position.rot_rz
        });
        this.vehicle.interface = this;
        this.vehicle.numberPlate = this.id.toString();
        //console.log("spawn set dirt to", (this.kmClean / dirt_mul))
        //this.vehicle.setVariable("dirt_level", (this.kmClean / dirt_mul))
        this.vehicle.setVariable("vid", this.id)
        veh_index[this.id] = this;
        this.loadTunes();
        console.log("spawn", this.vehicle.position);
        this.emit("created");
        this.update(0);
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
        this.db.save();
    }
    loadTunes() {
        if (!this.vehicle) return;
        Object.keys(this.tuning).forEach((name) => {
            let tune = this.tuning[name];
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
        this.db.pos_x = this.park_position.x;
        this.db.pos_y = this.park_position.y;
        this.db.pos_z = this.park_position.z;
        this.db.rot_rx = this.park_position.rx;
        this.db.rot_ry = this.park_position.ry;
        this.db.rot_rz = this.park_position.rz;
        this.db.tuning = JSON.stringify(this.tuning);
        this.db.data = JSON.stringify(this.data);
        this.db.save().then(() => {
            console.log("saved veh", this.db.data);
        }).catch(err => {
            console.log("err saving", err);
        })
        //this._tuning = this.db.data ? JSON.parse(this.db.data) : {};
    }
    update(dist = 0) {
        let data = this.data;
        if (!data.mTravel) data.mTravel = 0;
        if (!data.mClean) data.mClean = 0;
        if (data.fuel == undefined) data.fuel = 90;
        data.mTravel += dist;
        data.mClean += dist;
        let dirt_level = (data.mClean / dirt_mul) > 15 ? 15 : (data.mClean / dirt_mul);
        this.vehicle.setVariable("DIRT_LEVEL", dirt_level)
        let fuelConsumptionPerKM = 5.56 / 100;
        let kmTraveled = dist / 1000;
        if ((data.fuel - fuelConsumptionPerKM * kmTraveled) > 0) {
            data.fuel -= fuelConsumptionPerKM * kmTraveled;
        } else {
            data.fuel = 0;
            this.vehicle.engine = false;
            this.vehicle.setVariable("vehicle:engine:status", this.vehicle.engine)
            console.log("this.data",data);
            this.data = data;
        }
        this.data = data;
        this.vehicle.setVariable("FUEL_LEVEL", this.data.fuel)
        this.save();
    }
    toggleLock() {
        let newState = !this.vehicle.locked;
        this.vehicle.locked = newState;
    }
    toggleEngine() {
        if ((this.data.fuel) > 0) {
            let newState = !this.vehicle.engine;
            this.vehicle.engine = newState;
            this.vehicle.setVariable("vehicle:engine:status", this.vehicle.engine)
            //vehicle:engine:status
        } else {

            this.vehicle.engine = false;
            this.vehicle.setVariable("vehicle:engine:status", this.vehicle.engine)
        }
    }
}
mp.events.add("client:vehicle:update", (player, dist) => {
    console.log("client:vehicle:update", player.name, dist);
    let pVeh = player.vehicle;
    if (pVeh.interface) {
        console.log("has interface");
        pVeh.interface.update(dist);
    }
});
mp.events.add("vehicle:engine:toggle", (player) => {
    console.log("vehicle:engine:toggle", player.name);
    // seat player.seat;
    //let veh_index = veh_index[this.id]
    let pVeh = player.vehicle;
    console.log("pVeh", pVeh);
    if (pVeh.interface) {
        console.log("has interface");
        pVeh.interface.toggleEngine();
    } else {
        let newState = !pVeh.engine;
        pVeh.engine = newState;
        pVeh.setVariable("vehicle:engine:status", pVeh.engine)
    }
});
mp.events.add("vehicle:lock:toggle", (player) => {
    console.log("vehicle:lock:toggle", player.name);
    // seat player.seat;
    //let veh_index = veh_index[this.id]
    let pVeh = player.vehicle;
    if (pVeh.interface) {
        console.log("has interface");
        pVeh.interface.toggleLock();
    }
});
mp.events.add("vehicle:seatbelt:toggle", (player) => {
    console.log("vehicle:seatbelt:toggle", player.name);
    player.setVariable("vehicle:seatbelt:status", !player.getVariable("vehicle:seatbelt:status"))
});
mp.events.add("vehicle:light:toggle", (player) => {
    console.log("vehicle:light:toggle", player.name);
    let pVeh = player.vehicle;
    if (pVeh.interface) {
        pVeh.interface.lightState = !pVeh.interface.lightState;
        if (pVeh.interface.lightState == false) {
            pVeh.interface.lightMul = 0;
        } else {
            pVeh.interface.lightMul = 5;
        }
        player.setVariable("vehicle:light:status", {
            lightMul: pVeh.interface.lightMul,
            lightState: pVeh.interface.lightState,
        })
    }
});
class VehicleManager {
    constructor(parent) {
        console.log("parent veh TYPE", parent.type)
        /* Laod when Inventory is there*/
        this.parent = parent || {};
        this.player = this.parent.player || undefined;
        this.loadedVehs = [];
        this.vehicles = [];
        this.type = this.parent.type || TYPE.GLOBAL;
        this._keys = [];
        this.parent.inventory.once("server:storage:load", (f) => {
            console.log("server:storage:load")
            this.load();
        })
    }
    set keys(keys) {
        this._keys = keys;
    }
    load() {
        console.log("VehicleManager load");
        console.log("VehicleManager ", this.type);
        if (this.type == TYPE.PLAYER) {
            if (!this.parent.account.loggedIn) return;
            if (!this.parent.inventory.loaded) return;
        }
        console.log("G");
        let keys = this.parent.inventory.getItemsByClass(items.KEY_VEHICLE)
        console.log("key defined", keys);
        if (!keys) return new Error("key not defined");
        this._keys = keys.map(e => {
            return {
                key_id: e.key_id,
                vehicle_id: e.vehicle_id,
            }
        })
        console.log("owned_keys", this._keys);
        let oKeys = this._keys.map(e => {
            return e.vehicle_id
        });
        Vehicles.findAll({
            where: {
                vid: oKeys
            }
        }).then(vehs => {
            console.log("vehs", vehs);
            //if (!vehs.length) return console.log("not enough vehs");
            this.vehicles = vehs.map(e => {
                getKeyID.add(e.id);
                return {
                    db: e,
                    type: this.type
                }
            });
            console.log("this.vehicles", this.vehicles);
            this.spawnAll();
        }).catch(err => {
            console.log("error fetching vehs", err);
        })
        console.log("TODO load veh with keys");
    }
    spawnAll() {
        console.log("spawn all");
        this.vehicles.forEach(v => {
            this.loadedVehs.push(new Vehicle(v.db, undefined, this.type));
        })
    }
}
module.exports = {
    mgr: VehicleManager,
    vehicle: Vehicle
};