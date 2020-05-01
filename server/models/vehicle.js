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
    has(key_id) {
        return this._vehicles.find(e => {
            return e.key == key_id;
        })
    }
    add(key_id = null, id = null, data) {
        let veh = new Vehicle(key_id, id, data);
        this._vehicles.push(veh)
        return veh;
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
        this.kmTravel = 0;
        this.kmClean = 0;
        this._tuning = {};
        this.health = 500;
        this.armor = 1000;
        this.vehicle = undefined;
        this.worldType = worldType;
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
        console.log("SET MODEL ID",e);
        this.db.model_id = e;
    }
    get data() {
        let f = JSON.parse(JSON.parse(this.db.data));
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
    init() {
       // this.id = this.db.vid;
        console.log("this.db.model_id",this.db.model_id);
       // this.model = this.db.model_id;
        this.park_position = {
            x: this.db.pos_x,
            y: this.db.pos_y,
            z: this.db.pos_z,
            rx: this.db.rot_rx,
            ry: this.db.rot_ry,
            rz: this.db.rot_rz
        };
        this._tuning = this.db.data ? JSON.parse(this.db.data) : {};
        //this.player.setVariable("hunger_val", val);
        //this.kmTravel = this.db.kmTravel;
        //this.kmClean = this.db.kmClean;
        console.log("this._tuning",this._tuning);
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
            "data": JSON.stringify({})
        }).then((mVeh) => {
            this.id = mVeh.id;
            this.db = mVeh.db;
            this.init();
        })
    }
    tune(data) {
        this._tuning = Object.assign(this._tuning, data);
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
        this.db.x = this.park_position.x;
        this.db.y = this.park_position.y;
        this.db.z = this.park_position.z;
        this.db.rx = this.park_position.rx;
        this.db.ry = this.park_position.ry;
        this.db.rz = this.park_position.rz;
        this.db.data = JSON.stringify(this._tuning);
        this.db.save().then(() => {
            console.log("saved veh");
        }).catch(err => {
            console.log("err saving", err);
        })
        //this._tuning = this.db.data ? JSON.parse(this.db.data) : {};
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
mp.events.add("vehicle:seatbelt:toggle", (player) => {
    console.log("vehicle:seatbelt:toggle", player.name);
    player.setVariable("vehicle:seatbelt:status", !player.getVariable("vehicle:seatbelt:status"))
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