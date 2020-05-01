var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var Appearance = require("./appearance.js");
var Interaction = require("../interaction");
var VehicleManager = require("./vehicle.js").mgr;
var ItemManager = require("./storage.js").mgr;
var LogManager = require("./logs.js");
var e = require("../libs/utils.js").events;
require("../libs/items.js");
class WorldEntity extends EventEmitter {
    constructor(id = -1, type = TYPE.GLOBAL) {
        super();
        this._id = id;
        this.type = type || TYPE.GLOBAL;
        this.logger = new LogManager("WorldEntity", "undefined");
        this.inventory = new ItemManager(this);
        this.vehicles = new VehicleManager(this);
        console.log("World Entity Constructor")

    }
    get id() {
        return this._id;
    }
    get authState() {
        return 1;
    }
}
e.on("DatabaseConnected" ,() => {
	console.log("World Entity Loading",TYPE.GLOBAL)
    new WorldEntity(15, TYPE.GLOBAL);
});