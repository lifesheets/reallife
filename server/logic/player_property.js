var Animations = require("../libs/animations.js");
var Interaction = require("../interaction");
var Vehicle = require("../models/vehicle.js").vehicle;
var WebHooks = require('node-webhooks')
var getKeyID = require("../libs/utils.js").getKeyID;
var getUID = require("../libs/utils.js").getUID;
var items = require("../libs/items.js").items;
console.log(getUID.next());
console.log(getUID.next());
console.log(getKeyID.next());
console.log(getKeyID.next());
var webHooks = new WebHooks({
    db: './webHooksDB.json', // json file that store webhook URLs
    httpSuccessCodes: [200, 201, 202, 203, 204], //optional success http status codes
})
webHooks.add('commentDiscord', 'https://discordapp.com/api/webhooks/665736383800934430/2_ONewkeF0jvuruepC8C_RqZwv9Wb9gz1DJsa6zLgF4jS3dPB5PRr7JxCH4ASAo1IpB5').then(function() {
    console.log("added webhook")
}).catch(function(err) {
    console.log(err)
});
mp.events.addCommand("cash", (player, fullText, ...args) => {
    let cash = args[0];
    player.interface.money = parseInt(cash);
});
mp.events.addCommand("hunger", (player, fullText, ...args) => {
    let hunger = args[0];
    player.interface.hunger = parseInt(hunger);
});
mp.events.addCommand("p", (player, fullText, ...args) => {
    let name = args[0];
    let pos = player.position;
    webHooks.trigger('commentDiscord', {
        "content": "[" + name + "] " + pos.x + "," + pos.y + "," + pos.z,
        "username": "Position Hoe"
    })
});
mp.events.addCommand("r", (player, fullText, ...args) => {
    let veh = player.vehicle;
    console.log(veh);
    veh.interface.respawn();
});
mp.events.addCommand("park", (player, fullText, ...args) => {
    let veh = player.vehicle;
    console.log(veh);
    veh.interface.park();
    veh.interface.save();
});
mp.events.addCommand("rgb", (player, fullText, ...args) => {
    let veh = player.vehicle;
    let r = parseInt(args[0]);
    let g = parseInt(args[1]);
    let b = parseInt(args[2]);
    console.log(r, g, b);
    veh.interface.tune({
        "rgb": {
            r1: r,
            g1: g,
            b1: b,
            r2: r,
            g2: g,
            b2: b
        }
    });
    veh.interface.reloadTunings();
    veh.interface.save();
});
mp.events.addCommand("color", (player, fullText, ...args) => {
    let veh = player.vehicle;
    let f = parseInt(args[0]);
    let s = parseInt(args[1]);
    console.log(f, s);
    veh.interface.tune({
        "color": {
            first: f,
            second: s
        }
    });
    veh.interface.reloadTunings();
    veh.interface.save();
});
mp.events.addCommand("neon", (player, fullText, ...args) => {
    let veh = player.vehicle;
    let r = parseInt(args[0]);
    let g = parseInt(args[1]);
    let b = parseInt(args[2]);
    console.log(r, g, b);
    veh.interface.tune({
        "neon": {
            r: r,
            g: g,
            b: b
        }
    });
    veh.interface.reloadTunings();
    veh.interface.save();
});
mp.events.addCommand("tune", (player, fullText, ...args) => {
    let veh = player.vehicle;
    let type = parseInt(args[0]);
    let index = parseInt(args[1]);
    console.log(type, index);
    veh.interface.tune({
        [`mod_${type}`]: {
            type: type,
            index: index
        }
    });
    veh.interface.reloadTunings();
    veh.interface.save();
});
mp.events.addCommand("aveh", async (player, fullText, ...args) => {
    let pos = player.position;
    let model = args[0];
    if (!mp.joaat(model)) return;
    var veh = new Vehicle(null, {
        "model_id": model,
        "pos_x": pos.x,
        "pos_y": pos.y,
        "pos_z": pos.z,
        "rx": 0,
        "ry": 0,
        "rz": 0
    })
    veh.on("created", async () => {
        console.log("created veh");
        await player.inventory.addItem({
            type: ITEM.KEY_VEHICLE,
            owner_id: player.interface.id,
            owner_type: player.interface.type,
            pos_cell: -1,
            pos_row: -1,
            data: {
                key_id: veh.id,
                vehicle_id: veh.id
            }
        });
        player.inventory.sync();
        console.log("sync inventory");
    });
    console.log("create veh");
});