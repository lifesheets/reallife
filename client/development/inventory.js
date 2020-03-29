var Binds = require("./binds.js");
var CEFInventory = require("./browser.js").inventory;
CEFInventory.load("inventory/index.html");
mp.events.add("cef:inventory:ready", () => {
	mp.cache["inventory_ready"] = true;
});
var sample_inventory = [{
	image: "../../source/img/melone.png",
	name: "Melone",
	count: 100,
	type: "Nahrung",
	weight: 0.1
}, {
	image: "../../source/img/eisen.png",
	name: "Eisen",
	count: 21,
	type: "Rohstoff",
	weight: 0.4
}, {
	image: "../../source/img/m4.png",
	name: "M4 Sturmgewehr",
	count: 1,
	id: "SN8472095",
	type: "Waffe",
	weight: 1.3
}, {
	image: "../../source/img/m4.png",
	name: "M4 Sturmgewehr",
	count: 1,
	id: "SN8472094",
	type: "Waffe",
	weight: 1.3
}, {
	image: "../../source/img/ak47.png",
	name: "Ak47 Sturmgewehr",
	count: 1,
	id: "SN8472093",
	type: "Waffe",
	weight: 1.3
}]
//let rucksack = new StorageHandler("#character_storage", "Rucksack", 1)
//rucksack.toggle(true);
//rucksack.weight = 50;
//let inventar = new StorageHandler("#character_storage", "Inventar")
//inventar.weight = 250;
//let kofferraum = new StorageHandler("body", "Kofferraum")
//kofferraum.weight = 550;
//addUnit(parent,selector,options,max_rows)
//
var storage_units = [];
var visibleStorage = [];
class storage {
	constructor(parent, selector, options = null, max_rows = 0) {
		this.maxRows = max_rows;
		this.items = [];
		this.name = selector;
		this._max_weight = 100;
		this.type = "storage"
		this.selector = selector;
		this.parent = parent;
		this._condition = () => {
			return false;
		};
		this.id = undefined;
		this.toggled = false;
		CEFInventory.call("addUnit", parent, selector, options, max_rows);
		storage_units[this.selector.toLowerCase()] = this;
	}
	toggle() {
		console.log("load", !this.toggled)
		this.toggled = !this.toggled;
		CEFInventory.call("toggleStorage", this.selector, this.toggled);
		console.log("toggle", this.toggled)
		if (this.toggled) {
			visibleStorage.push(this.name);
		} else {
			visibleStorage.splice(visibleStorage.indexOf(this.name), 1);
		}
		if (visibleStorage.length > 0) {
			CEFInventory.cursor(true);
		} else {
			CEFInventory.cursor(false);
		}
	}
	set title(t) {
		this._title = t;
		CEFInventory.call("editTitle", this.selector, this._title);
	}
	set weight(w = 100) {
		this._max_weight = w;
		CEFInventory.call("editStorageMaxWeight", this.selector, this._max_weight);
		console.log("_max_weight", this._max_weight)
	}
	set condition(condition_func) {
		this._condition = condition_func;
	}
	load(items) {
		console.log("load")
		//this._condition = condition_func;
		this.items = items;
		CEFInventory.call("loadStorage", this.selector, this.items);
	}
}
var backpack;
var inventory;
var storageSpace;
backpack = new storage("#character_storage", "backpack", null, 1)
backpack.weight = 100;
backpack.title = "begpek";
inventory = new storage("#character_storage", "inventory")
inventory.weight = 400;
inventory.title = "Inventar";
storageSpace = new storage("body", "storage")
storageSpace.weight = 200;
storageSpace.title = "Lager";
var disabled = [];
mp.events.add("server:inventory:init", (id) => {
	console.log("created")
});
mp.events.add("server:inventory:set", (selector, title, id,state = false) => {
	//storage_units
	if (storage_units[selector.toLowerCase()]) {
		storage_units[selector.toLowerCase()].title = title;
		storage_units[selector.toLowerCase()].id = id;
		disabled[selector.toLowerCase()] = !state;
	}
});




mp.events.add("cef:inventory:use", (target, items) => {
	if (!mp.loggedIn) return;
	//console.log("items", items);
});
mp.events.add("server:inventory:load", (target, items) => {
	console.log("mp.loggedIn", mp.loggedIn);
	if (!mp.loggedIn) return;
	//console.log("server:inventory:load", items);
	if (storage_units[target.toLowerCase()]) {
		storage_units[target.toLowerCase()].load(items);;
	}
});
/*CEFHud.call("addUnit", "#character_storage", "Rucksack", null,1);
CEFHud.call("addUnit", "#character_storage", "Inventar", null,0);
CEFHud.call("addUnit", "body", "Kofferraum", null,0);
CEFHud.call("editStorageMaxWeight","Kofferraum", null,0);*/