var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var Appearance = require("./appearance.js");
var Account = require("./account.js");
var Interaction = require("../interaction");
var Vehicles = require("../database").vehicles;
class Player extends EventEmitter {
	constructor(player) {
		super();
		this.id = -1;
		this.player = player;
		this.account = new Account(this);
		this.appearance = new Appearance(this);
		this.cState = "auth";


		this._money = 0;
		this._bankmoney = 0;


		this._group = 0;
	}
	set money(val) {
		// logic
		this._money = val;
	}
	get money( ){
		return this._money;
	}

	set state(v) {
		this.cState = v;
	}
	get state() {
		return this.cState;
	}
	playAnimSync(dict, name, speed, speedMultiplier, duration, flag, playbackRate, lockX, lockY, lockZ, timeout = 0) {
		let id = this.player.id;
		mp.players.forEachInRange(this.player.position, 200, (tPlayer) => {
			tPlayer.call("client:sync:playanimation", [id, dict, name, speed, speedMultiplier, duration, flag, playbackRate, lockX, lockY, lockZ, timeout])
		});
	}
	interact(key){
		this.emit("interact",key);
	}

	spawn() {
		let spawnPoint = new mp.Vector3(-96.99, -1137.83, 27.92);

		this.player.spawn(spawnPoint);
		this.appearance.load();
		this.player.dimension = 0;


	}
}

mp.Player.prototype.__defineGetter__("interface", function() {
	if (!this.interface_class) {
		this.interface_class = new Player(this);
		Animations.send(this);
	}
	return this.interface_class;
});