var EventEmitter = require('events').EventEmitter;
var items = require("../libs/items.js").items;
var getClass = require("../libs/items.js").getClass;
var getName = require("../libs/items.js").getName;
var weight = require("../libs/items.js").weights;
var unique = require("../libs/items.js").unique;
var ownerTypes = require("../libs/items.js").ownerTypes;
var getKeyID = require("../libs/utils.js").getKeyID;
var getUID = require("../libs/utils.js").getUID;
var Unique_ItemDB = require("../database").uniqueItem;
var Common_ItemDB = require("../database").commingItem;
class Item extends EventEmitter {
    constructor(db_handle, data = false) {
        super();
        //this.uid = getUID.next().value; // runtime-unique stack id for instance
        console.log(db_handle.id);
        console.log(db_handle.data);
        this.db = db_handle;
        this.ready = false;
        this._key_id = 125;
        if (this.db_handle == null) {
            this.create(data);
        } else {
            this.init();
        }
        console.log("item constructor")
    }
    get id() {
        if ((!this.db) || (!this.ready)) return -1;
        return this.db.id;
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
    get data() {
        let f = JSON.parse(JSON.parse(this.db.data));
        return f;
    }
    set data(d) {
        console.log("d", d)
        this.db.data = JSON.stringifyIfObject(d);
    }
    get isUnique() {
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
        if (!data.type) new Error("Error creating Item", "No Typ");
        let DataStruct = {};
        console.log("is item unique", unique(getClass(data.type)));
        if (unique(getClass(data.type))) {
            DataStruct = {
                type: data.type,
                owner_id: data.owner_id,
                owner_type: data.owner_type,
                pos_cell: -1,
                pos_row: -1,
                data: JSON.stringify(data.data)
            };
            Unique_ItemDB.create(DataStruct).then(dbItem => {
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
                owner_type: data.owner_type,
                pos_cell: -1,
                pos_row: -1,
                count: data.count
            };
            Common_ItemDB.create(DataStruct).then(dbItem => {
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
        console.log("item init");
    }
    async destroy(target = null) {
        console.log("destroy target", target);
        // todo selfdescuct
        return true;
    }
    parse() {
        if (!this.db) return new Error("No Db Handle");
        // TODO PARSE
        return JSON.stringify({
            id: this.id,
            type: this.type,
            class: this.class,
            count: this.count
        }) // TODO
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
        console.log("getting weapon hash for", this.uid, "type", this.type);
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
        console.log("first");
        if (getClass(this.type) != ITEMCLASS.KEYS) return new Error("Item invalid type", this.type);
        console.log("sec this.data", this.data);
        let d = this.data;
        console.log("this.data.key_id", this.data)
        if (!this.data.key_id) return new Error("Item has no key_id type");
        return this.data["key_id"];
    }
    get vehicle_id() {
        console.log("first");
        if (getClass(this.type) != ITEMCLASS.KEYS) return new Error("Item invalid type", this.type);
        if (!this.data.vehicle_id) return new Error("Item has no vehicle_id type", this.type);
        return this.data.vehicle_id;
    }
}
class ItemManager extends EventEmitter {
    constructor(parent) {
        super();
        this.parent = parent || {};
        this.player = this.parent.player || undefined;
        this.type = this.parent.type || TYPE.GLOBAL;
        this.id = this.parent.id
        console.log("this.type", this.type);
        this._items = [];
        this.loaded = false;
        if (this.type != TYPE.PLAYER) {
            this.load();
        } else {
            this.id = this.parent.id
        }
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
                ritems.push(item.parse());
            }
        });
        return ritems;
    }
    getItemsByClass(classId) {
        return this._items.filter(e => {
            return e.class == classId;
        })
    }
    getItemByID(itemid) {
        return this._items.find(e => {
            return e.id == itemid;
        })
    }
    modifyItem(tomerge) {
        console.log("TODO MODIFY ITEM");
    }
    async addItem(iData) {
        if (iData.type == undefined) throw new Error("type not defined");
        if (iData.owner_id == undefined) throw new Error("owner_id not defined");
        if (iData.owner_type == undefined) throw new Error("owner_type not defined");
        let pItem = this.getItemByID(iData.type);
        let cItem;
        if (!unique(getClass(iData.type)) && pItem) {
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
        if ((this.parent.type == TYPE.PLAYER) && (!this.parent.account.loggedIn)) return;
        console.log("owner_id", this.parent.id)
        console.log("type", this.type)
        console.log("this.parent", this.parent);
        Promise.all([
            Unique_ItemDB.findAll({
                where: {
                    owner_id: this.parent.id,
                    owner_type: this.type
                }
            }),
            Common_ItemDB.findAll({
                where: {
                    owner_id: this.parent.id,
                    owner_type: this.type
                }
            })
        ]).then(([commonItems, uniqueItems]) => {
            console.log("items", commonItems, uniqueItems)
            this._items = [];
            console.log("items", items);
            [...commonItems, ...uniqueItems].forEach(i => {
                let cItem = new Item(i, undefined);
                this._items.push(cItem);
            })
            console.log("server:storage:load fire")
            this.emit("server:storage:load", this.parent.id);
        }).catch(err => {
            console.log("error fetching items", err);
        })
        /*


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
                    this.emit("server:storage:load", this.parent.id);
                }).catch(err => {
                    console.log("error fetching items", err);
                })*/
        console.log("load items");
    }
}
/*DEBUG*/
mp.events.addCommand("list", (player, fullText, ...args) => {
    let items = player.interface.inventory.items;
    items.forEach(function(item) {
        console.log(item.parse())
    })
});
mp.events.addCommand("common", async (player) => {
    await player.interface.inventory.addItem({
        type: ITEM.FOOD_MELON,
        owner_id: player.interface.id,
        owner_type: player.interface.type,
        pos_cell: -1,
        pos_row: -1,
        data: {},
        count: 15
    });
    player.interface.inventory.sync();
});
mp.events.addCommand("unique", async (player) => {
    await player.interface.inventory.addItem({
        type: ITEM.WEAPON_M4,
        owner_id: player.interface.id,
        owner_type: player.interface.type,
        pos_cell: -1,
        pos_row: -1,
        data: {},
        count: 15
    });
    player.interface.inventory.sync();
});
/*DEBUG*/
module.exports = {
    mgr: ItemManager,
    item: Item
};