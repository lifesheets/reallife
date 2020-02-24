//server:inventory:load
var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var StorageItems = require("../database").storage;
var bcrypt = require('bcryptjs');
var translateItemToAnim = [];
var I = require("../libs/items.js").items;
var Classes = require("../libs/items.js").classes;
var id_count = 0;
function* getUID() {
  while (true) {
	id_count+=1;
  	yield id_count;
  }
}



class Item extends EventEmitter {
	constructor(data) {
		if (!data) throw new Error("Item has no data");
		super();
		this.data = data;
		this.uid = getUID().next().value;
		this.db_handle = undefined;

		console.log("this.uid",this.uid);
	}
	set db(hDB) {
		this.db_handle = hDB;
	}
	get db() {
		return this.db_handle;
	}
	get name() {

	}
	get count() {

	}
	use() {

	}
	parse() {

	}
}

class ItemManager {
	constructor(parent) {
		this.parent = parent;
		this.player = parent.player;
		this._items = [];
		console.log("Player ItemManager constructor")
	}
	get items() {

	}
	modifyItem(tomerge) {
		console.log("TODO MODIFY ITEM");
	}
	addItem(iData) {
		iData.owner_id = this.parent.id;

		StorageItems.create({
			"owner_id": iData.owner_id,
			"itemid":iData.itemid,
			"count":iData.count,
			"data":JSON.stringify(iData.data)
		}).then((gItem) => {
			let cItem = new Item(gItem);
			cItem.db = gItem;
			this.items.push(cItem);
			console.log("gItem",gItem);
		})
	}
	load() {
		if (!this.parent.account.loggedIn) return;
		StorageItems.findAll({
			where: {
				owner_id: this.parent.id
			}
		}).then(items => {
			console.log("items", items);
			items.forEach(i => {
				let cItem = new Item(i);
				cItem.db = i;
				this.items.push(cItem);
			})
			console.log(this.items);
			//if (!vehs.length) return console.log("not enough vehs");
			/*this.vehicles = vehs.map(e => {
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
			console.log("this.vehicles", this.vehicles);*/
		}).catch(err => {
			console.log("error fetching vehs", err);
		})
		console.log("load veh");
	}
}


/*DEBUG*/

mp.events.addCommand("addItem", (player, fullText, ...args) => {
	player.interface.inventory.addItem({
		count:2,
		itemid:WEAPON_M4,
		data:[{id:"TESTITEM1"},{id:"TESTITEM2"}]
	});
});

/*DEBUG*/


module.exports = {
	mgr: ItemManager,
	item: Item
};