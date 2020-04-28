var EventEmitter = require('events').EventEmitter;
var items = require("../libs/items.js").items;
var getClass = require("../libs/items.js").getClass;
var getName = require("../libs/items.js").getName;
var weight = require("../libs/items.js").weights;
var unique = require("../libs/items.js").unique;
var ownerTypes = require("../libs/items.js").ownerTypes;
var getKeyID = require("../libs/utils.js").getKeyID;
var getUID = require("../libs/utils.js").getUID;

var Unique_Item;
var Common_Item;
class Item extends EventEmitter {
	constructor(db_handle,data = false) {

		//this.uid = getUID.next().value; // runtime-unique stack id for instance
		this.db = db_handle;
		this.ready = false;
		if (this.db_handle == null) {
			this.create(data);
		}
	}
	get uid( ){
		if ((!this.db) || (!this.ready)) return -1;
		return this.db.uid;
	}
	get created() {
		return this.db != undefined;
	}
	set db(d) {
		this.db_handle = d;
	}
	get db() {
		return this.db_handle;
	}
	get ísUnique() {
		if ((!this.db) || (!this.ready)) return "-";
		return (unique(getClass(data.type)));
	}
	get type() {
		if ((!this.db) || (!this.ready)) return "-";
		return getClass(this.db.type);
	}
	get count() {
		if (!this.db) return new Error("no db handle");
		return this.db.count;
	}
	async save() {
		if ((this.db) && (this.ready)) {
			this.last_saved = Date.now();
			await this.db.save();
			return;
		}
		return new Error("no db handle");
	}
	get class() {
		return getClass(this.type)
	}
	get name() {
		return getName(this.db);
	}
	get data() {
		return JSON.parse(this.db.data);
	}
	set data(d) {
		console.log("d", d)
		this.db.data = JSON.stringify(d);
	}
	get weight() {
		return weight(this.type)
	}
	get count() {
		return this.db.count;
	}
	set count(to) {
		this.db.count = to;
	}
	create(data) {
		if (!data.typ) new Error("Error creating Item", "No Typ");
		let DataStruct = {};
		if (unique(getClass(data.type))) {
			DataStruct = {
			    type: data.type,
			    owner_id: data.owner_id,
			    owner_typ: data.owner_typ,
			    pos_cell: -1,
			    pos_row: -1,
			    data: JSON.stringify(data.data)
			};
			Unique_Item.create(DataStruct).then(dbItem => {
				this.db = gItem;
				this.init();
			}).catch(err => {
				return new Error("Error creating Item", err);
				return false;
			})
		} else {
			DataStruct = {
			    type: data.type,
			    owner_id: data.owner_id,
			    owner_typ: data.owner_typ,
			    pos_cell: -1,
			    pos_row: -1,
			    count: data.count
			};
			Common_Item.create(DataStruct).then(dbItem => {
				this.db = gItem;
				this.init();
			}).catch(err => {
				return new Error("Error creating Item", err);
				return false;
			})
		}
	}
	init() {
		this.ready = true;
	}
	async destroy(target = null) {
		console.log("destroy target", target);
		// todo selfdescuct
		return true;
	}
	parse() {
		if (!this.db) return new Error("No Db Handle");
		// TODO PARSE
		return JSON.stringify({}) // TODO
	}	

	get componentVariation() {
		if (getClass(this.type) != ITEMCLASS.CLOTHING) return new Error("Item invalid type", this.type);
		return {
			componentNumber: this.data.componentNumber,
			drawable: this.data.drawable,
			texture: this.data.texture,
			palette: this.data.palette
		}
	}

	get weapon() {
		if (getClass(this.type) != ITEMCLASS.WEAPON) return new Error("Item invalid type", this.type);
		console.log("getting weapon hash for",this.uid,"type",this.type);

		return 0; // todo: define weapon hashes for item ids.


	}

	/* Item Data for Weapon Components
	{
		hash:"MODEL HASH"
	}
	*/
	get weaponComponents() {
		if (getClass(this.type) != ITEMCLASS.WEAPON) return new Error("Item invalid type", this.type);
		return this.data.map(e => {
			return {
				hash: e.hash
			}
		}).filter(e => {
			return e.hash != undefined;
		})
	}
	get ammoType() {
		if (getClass(this.type) != ITEMCLASS.WEAPON) return new Error("Item invalid type", this.type);
		console.log("TODO define ammoType")
		return 0;
	}
	get key_id() {
		if (getClass(this.type) != ITEMCLASS.KEYS) return new Error("Item invalid type", this.type);
		if (!this.data.key_id) return new Error("Item has no key_id type", this.type);
		return this.data.key_id;
	}
}

class ItemManager extends EventEmitter{
	constructor(parent) {
		super();
		this.parent = parent;
		this.player = parent.player;
		this._items = [];
		this.loaded = false;
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
		if (iData.typ == undefined) throw new Error("itemid not defined");
		if (iData.count == undefined) throw new Error("count not defined");
		if (iData.dump == undefined) throw new Error("data not defined");
		iData.owner_id = this.parent.id;
		iData.owner_type = "player";
		let pItem = this.getItemByID(iData.type);
		let cItem;
		if (!unique(iClass.getClass(iData.type)) && pItem) {
			// merge items;
			console.log("merge");
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
		this.player.call("server:storage:load", [this.parent.id, this.render_items])
	}
	load() {
		if((!this.parent.account.loggedIn) && (this.parent.type == "player")) return;
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
			if (this.player) {
				this.player.call("server:storage:load", [this.parent.id, this.render_items])
			}
			this.loaded = true;
			this.emit("server:storage:load",this.parent.id);
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


