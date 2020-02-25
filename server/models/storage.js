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
class Item extends EventEmitter {
	constructor(db_handle) {
		if (!db_handle) throw new Error("Item has no handle");
		super();
		this.uid = getUID().next().value; // unique stack id for instance
		this.db_handle = db_handle;
		console.log("this.uid", this.uid);
	}
	save() {
		if (this.db_handle) this.db_handle.save();
		return new Error("no db handle");
	}
	get db() {
		return this.db_handle;
	}
	get itemid() {
		console.log("this.db_handle", this.db_handle.itemid)
		return this.db_handle.itemid
	}
	get name() {
		console.log("this.db_handle", this.db_handle.itemid)
		return itemnames.getName(this.db_handle);
	}
	get data() {
		console.log("this.db_handle.data", this.db_handle.data)
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
		let data_length = change_to.data.length;
		console.log("data_length", data_length);
		console.log("this.count", this.count);
		if (data_length != this.count) {
			return false;
		}
		return true;
	}
	merge(object) {
		console.log("merge", object);
		this.save();
	}
	use() {}
	parse() {}


	update() {
		//if ()


	}
	minify() {
		if (!this.validate()) return;
		let m = [];
		console.log(typeof this.data);
		if (Array.isArray(this.data)) {
			this.data.forEach(e => {
				console.log("weight", this.weight);
				let c = {};
				c.name = this.name;
				c.count = 1;
				c.type = classes.getClass(this.itemid);
				if (e.id) {
					c.id = e.id;
				}
				c.weight = this.weight;
				c.uid = this.uid;
				c.data = e;
				m.push(c)
			})
		} else {
			let c = {};
			c.name = this.name;
			c.count = this.count;
			c.type = classes.getClass(this.itemid);
			if (this.data.id) {
				c.id = this.data.id;
			}
			c.weight = this.weight;
			c.uid = this.uid;
			c.data = this.data;
			m.push(c)
		}
		return m;
	}
}
class ItemManager {
	constructor(parent) {
		this.parent = parent;
		this.player = parent.player;
		this._items = [];
		console.log("Player ItemManager constructor")
	}
	getHandle(item) {
		let handle = this._items.find((e) => {
			return e.uid == item.uid;
		})
		return handle
	}
	get items() {
		return this._items;
	}
	get render_items() {
		let ritems = [];
		this.items.forEach(item => {
			let minified = item.minify();
			minified.forEach(e => {
				ritems.push(e);
			})
		});
		return ritems;
	}
	modifyItem(tomerge) {
		console.log("TODO MODIFY ITEM");
	}
	async addItem(iData) {
		iData.owner_id = this.parent.id;
		StorageItems.findOne({
			where: {
				owner_id: iData.owner_id,
				itemid: iData.itemid
			}
		}).then(pItem => {
			console.log("pItem", pItem != null);
			if (pItem == null) {
				StorageItems.create({
					"owner_id": iData.owner_id,
					"itemid": iData.itemid,
					"count": iData.count,
					"data": JSON.stringify(iData.data)
				}).then((gItem) => {
					let cItem = new Item(gItem);
					this._items.push(cItem);
					console.log("cItem", cItem);
					return cItem;
				})
			} else {
				let cItem = this.getHandle(pItem);
				if (!cItem) {
					cItem = new Item(pItem);
					this._items.push(cItem);
				}
				cItem.merge(iData);
				console.log("mergin items", cItem, iData);
				//pAccount
				return cItem;
			}
		});
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
				let cItem = new Item(i);
				this._items.push(cItem);
			})
			console.log(this._items);
			//server:inventory:load
			//server:inventory:load
			this.player.call("server:inventory:load", ["Inventar", this.render_items])
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
mp.events.addCommand("addItem", (player, fullText, ...args) => {
	player.interface.inventory.addItem({
		count: 1,
		itemid: WEAPON_M4,
		data: [{
			id: Math.random() * 100
		}]
	});
});
/*DEBUG*/
module.exports = {
	mgr: ItemManager,
	item: Item
};