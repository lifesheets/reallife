//server:inventory:load
var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var StorageItems = require("../database").storage;
var bcrypt = require('bcryptjs');
var translateItemToAnim = [];
var items = require("../libs/items.js").items;
var classes = require("../libs/items.js").classes;
var itemnames = require("../libs/items.js").names;
var weight = require("../libs/items.js").weights;
var unique = require("../libs/items.js").unique;
var id_count = 0;

function* getUID() {
	while (true) {
		id_count += 1;
		yield id_count;
	}
}
/*var sample_inventory = [{
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
}]*/

class SubItem extends EventEmitter {
	constructor(subData, parent) {
		this.data = subData;
		this.parent = parent;
		console.log("SubItem of Parent", parent.uid, "SubData", subData);
	}
}
class Item extends EventEmitter {
	constructor(db_handle, data) {
		console.log("db_handle", db_handle);
		console.log("data", data);
		if ((!db_handle) && (!data)) throw new Error("Item has no handle/data");
		super();
		this.uid = getUID().next().value; // unique stack id for instance
		if (!db_handle && data) {
			this.create(data);
		}
		this.last_saved = 0;
		this.db_handle = db_handle || undefined;
		this.cache = undefined;
		console.log("this.uid", this.uid);
	}
	get isItem() {
		return true;
	}
	get created() {
		return this.db_handle != undefined;
	}
	set db(d) {
		this.db_handle = d;
	}
	get db() {
		return this.db_handle;
	}
	async destroy() {
		// todo selfdescuct
		return true;
	}
	create(data) {
		StorageItems.create({
			"owner_id": data.owner_id,
			"itemid": data.itemid,
			"count": data.count,
			"data": JSON.stringify(data.data)
		}).then(gItem => {
			this.db = gItem;
			return gItem;
		}).catch(err => {
			return new Error("Error creating Item", err);
			return false;
		})
	}
	async save() {
		if (this.db_handle) {
			this.last_saved = Date.now();
			await this.db_handle.save();
			return;
		}
		return new Error("no db handle");
	}
	get itemid() {
		return this.db_handle.itemid
	}
	get class() {
		let c = classes.getClass(this.itemid);
		return c
	}
	get name() {
		return itemnames.getName(this.db_handle);
	}
	get data() {
		return JSON.parse(this.db_handle.data);
	}
	set data(d) {
		console.log("d", d)
		this.db_handle.data = JSON.stringify(d);
	}
	get weight() {
		return weight(this.itemid)
	}
	get count() {
		return this.db_handle.count;
	}
	set count(to) {
		this.db_handle.count = to;
	}
	validate(change_to) {
		if (!change_to) change_to = this;
		if (this.itemid != change_to.itemid) return false;
		return true;
	}
	async merge(object) {
		if (!this.validate(object)) return;
		console.log("merge with", object);
		this.count += object.count;
		this.data = this.data.concat(object.data);
		if (object.isItem) {
			console.log("Is item");
			await object.destroy();
		}
		console.log("merge", object);
		await this.save();
	}
	use() {}
	parse() {}
	update() {
		//if ()
	}
	minify() {
		if (!this.validate()) return;
		console.log(typeof this.data);
		let c = {};
		c.name = this.name;
		c.count = this.count;
		c.type = classes.getClass(this.itemid);
		c.weight = this.weight;
		c.uid = this.uid;
		if (this.data.length > 1) {
			c.data = JSON.stringify(this.data);
		} else if (this.data.length == 1) {
			c.id = this.data[0].id;
			c.data = JSON.stringify(this.data[0]);
		}
		return c;
	}
}
class Clothing extends Item{
	get isItem() {
		return false;
	}
}

class ItemManager {
	constructor(parent) {
		this.parent = parent;
		this.player = parent.player;
		this._items = [];
		console.log("ItemManager constructor")
	}
	getHandle(item) {
		return this._items.find(e => {
			return e.uid == item.uid;
		})
	}
	remove(uid) {
		//todo remove item by uid
	}
	get items() {
		return this._items;
	}
	get render_items() {
		let ritems = [];
		this.items.forEach(item => {
			if (item.created) {
				ritems.push(item.minify());
			}
		});
		return ritems;
	}
	getItemByID(itemid) {
		return this._items.find(e => {
			return e.itemid == itemid;
		})
	}
	modifyItem(tomerge) {
		console.log("TODO MODIFY ITEM");
	}
	async addItem(iData) {
		if (iData.itemid == undefined) throw new Error("itemid not defined");
		iData.owner_id = this.parent.id;
		let pItem = this.getItemByID(iData.itemid);
		let cItem;
		if (!unique(classes.getClass(iData.itemid)) && pItem) {
			// merge items;
			cItem = await pItem.merge(iData)
		} else {
			// create new
			console.log("create");
			cItem = new Item(undefined, iData);
			this._items.push(cItem);
		}
		console.log("added item",iData);
		return cItem;
	}
	sync() {
		if (!this.player) return;
		this.player.call("server:inventory:load", ["Inventar", this.render_items])
	}
	load() {
		if (!this.parent.account.loggedIn) return;
		StorageItems.findAll({
			where: {
				owner_id: this.parent.id
			}
		}).then(items => {
			this._items = [];
			console.log("items", items);
			items.forEach(i => {
				let cItem = new Item(i, undefined);
				this._items.push(cItem);
			})
			console.log(this._items);
			//server:inventory:load
			//server:inventory:load
			if (this.player) {

				this.player.call("server:inventory:set", ["inventory","Inventar",this.parent.id,true])
				this.player.call("server:inventory:set", ["equipment","Ausrüstung",this.parent.id,true])
				this.player.call("server:inventory:load", ["inventory", this.render_items])

			}
		}).catch(err => {
			console.log("error fetching items", err);
		})
		console.log("load items");
	}
}
/*DEBUG*/
mp.events.addCommand("list", (player, fullText, ...args) => {
	let items = player.interface.inventory.items;
	items.forEach(function(item) {
		console.log(item.minify())
	})
});
mp.events.addCommand("a", async (player, fullText, ...args) => {
	await player.interface.inventory.addItem({
		count: 1,
		itemid: parseInt(args[0]),
		data: []
	});
	player.interface.inventory.sync();
});
/*DEBUG*/
module.exports = {
	mgr: ItemManager,
	item: Item
};