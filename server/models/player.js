var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var Appearance = require("./appearance.js");
var Account = require("./account.js");
var Interaction = require("../interaction");
var VehicleManager = require("./vehicle.js").mgr;
class Player extends EventEmitter {
	constructor(player) {
		super();
		this.player = player;
		this.account = new Account(this);
		this.appearance = new Appearance(this);
		this.vehicles = new VehicleManager(this);
		this.cState = "auth";
		this._money = 0;
		this._bankmoney = 0;
		this._group = 0;
		this._damageLog = [];

		this._hunger = 0;
	}
	get id() {
		if (!this.account.loggedIn) return;
		return this.account.id;
	}
	get status() {
		if (!this.account.status) return;
		return this.account.status;
	}
	set hunger(val) {
		this._hunger = val;
		this.player.setVariable("hunger_val", val);
		//updateHunger(progress)
	}
	set money(val) {
		// logic
		this._money = val;
	}
	set money(val) {
		this._money = val;
		this.player.setVariable("cash_hand", val);
	}
	get money() {
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
	interact(key) {
		this.emit("interact", key);
	}
	death(reason, killer, event = false) {
		this.player.setVariable("death", true);
		setTimeout(() => {
			this.spawn();
		}, 5000);
	}
	async spawn() {
		let spawnPoint = new mp.Vector3(-96.99, -1137.83, 27.92);
		this.player.spawn(spawnPoint);
		this.appearance.load();
		this.player.dimension = 0;
		this.money = 100;
		this.player.call("server:game:start");
		this.player.setVariable("spawned", true);
		this.player.setVariable("death", false);
	}
}
mp.events.add("playerDeath", (player, reason, killer) => {
	console.log("player died", player.name);
	if (player.interface) {
		player.interface.death(reason, killer, true);
	}
});
mp.Player.prototype.__defineGetter__("interface", function() {
	if (!this.interface_class) {
		this.interface_class = new Player(this);
		Animations.send(this);
	}
	return this.interface_class;
});