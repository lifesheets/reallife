//server:inventory:load
var EventEmitter = require('events').EventEmitter;
var Animations = require("../libs/animations.js");
var StorageItems = require("../database").storage;
var bcrypt = require('bcryptjs');
var translateItemToAnim = [];
var items = require("../libs/items.js").items;
var iClass = require("../libs/items.js").classes;
var itemnames = require("../libs/items.js").names;
var weight = require("../libs/items.js").weights;
var unique = require("../libs/items.js").unique;
var getKeyID = require("../libs/utils.js").getKeyID;
var getUID = require("../libs/utils.js").getUID;

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
		this.uid = getUID.next().value; // runtime-unique id for instance
		console.log("SubItem of Parent", parent.uid, "SubData", subData);
	}
	get id() {
		if (!this.data.id) return new Error("SubItem has no data.id");
		return this.data.id;
	}
	get type() {
		return this.parent.class;
	}
	destroy() {
		console.log("TODO Destroy Sub")
	}
	/* Item Data for Weapons
	{
		componentNumber: this.data.componentNumber,
		drawable: this.data.drawable,
		texture: this.data.texture,
		palette: this.data.palette
	}
	*/
	get componentVariation() {
		if (this.type != iClass.CLOTHES) return new Error("SubItem invalid type", this.type);
		return {
			componentNumber: this.data.componentNumber,
			drawable: this.data.drawable,
			texture: this.data.texture,
			palette: this.data.palette
		}
	}
	/* Item Data for Weapon Components
	{
		hash:"MODEL HASH"
	}
	*/
	get weaponComponents() {
		if (this.type != iClass.WEAPON) return new Error("SubItem invalid type", this.type);
		return this.data.map(e => {
			return {
				hash: e.hash
			}
		})
	}
	get ammoType() {
		if (this.type != iClass.WEAPON) return new Error("SubItem invalid type", this.type);
		console.log("TODO define ammoType")
		return 0;
	}
	get key_id() {
		if (this.type != iClass.KEY) return new Error("SubItem invalid type", this.type);
		if (!this.data.key_id) return new Error("SubItem has no key_id type", this.type);
		return this.data.key_id;
	}
	copy() {}
	stringify() {
		return {
			test: true
		}
	}
}
class Item extends EventEmitter {
	constructor(db_handle, data) {
		console.log("db_handle", db_handle);
		console.log("data", data);
		if ((!db_handle) && (!data)) throw new Error("Item has no handle/data");
		super();
		this.uid = getUID.next().value; // runtime-unique stack id for instance
		if (!db_handle && data) {
			if (typeof data[0] != "object") data = [data];
			this.create(data);
		}
		this.last_saved = 0;
		this.db_handle = db_handle || undefined;
		this.cache = undefined;
		this.subItems = [];
		this.initiated = false;
		console.log("this.uid", this.uid);
	}
	init() {
		if (!this.db_handle) return;
		this.subItems = this.data.map((e, i) => {
			return new SubItem(e, this);
		})
		this.initiated = true;
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
	async destroy(target = null) {
		console.log("destroy target", target);
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
			this.init();
		}).catch(err => {
			return new Error("Error creating Item", err);
			return false;
		})
	}
	async save() {
		if ((this.db_handle) && (this.initiated)) {
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
		return iClass.getClass(this.itemid)
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
	get sub() {}
	validate(change_to) {
		if (!change_to) change_to = this;
		if (this.itemid != change_to.itemid) return new Error("itemid not defined");
		if (unique(iClass.getClass(this.itemid)) && this.count != 1) return new Error("unqiue item and count > 1");
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
		this.init();
		await this.save();
	}
	use() {}
	parse() {}
	update() {
		//if ()
	}
	stringify() {
		if (!this.validate()) return;
		console.log("minify", typeof this.data);
		let c = {};
		c.name = this.name;
		c.count = this.count;
		c.type = iClass.getClass(this.itemid);
		c.weight = this.weight;
		c.uid = this.uid;
		if (this.data.length > 1) {
			c.data = JSON.stringify(this.data.map(e => {
				return e.stringify();
			}));
		} else if (this.data.length == 1) {
			c.id = this.data[0].id;
			c.data = JSON.stringify(this.data[0].stringify());
		}
		return c;
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
				ritems.push(item.stringify());
			}
		});
		return ritems;
	}
	getItemsByClass(classId) {
		return this._items.find(e => {
			return e.class == classId;
		})
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
		if (iData.count == undefined) throw new Error("count not defined");
		if (iData.data == undefined) throw new Error("data not defined");
		iData.owner_id = this.parent.id;
		let pItem = this.getItemByID(iData.itemid);
		let cItem;
		if (!unique(iClass.getClass(iData.itemid)) && pItem) {
			// merge items;
			cItem = await pItem.merge(iData)
		} else {
			// create new
			console.log("create");
			cItem = new Item(undefined, iData);
			this._items.push(cItem);
		}
		console.log("added item", iData);
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
				this.player.call("server:inventory:set", ["inventory", "Inventar", this.parent.id, true])
				this.player.call("server:inventory:set", ["equipment", "Ausrüstung", this.parent.id, true])
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