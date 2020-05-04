//mp.events.delayInitialization = true;
var db = require("./database");
require("./libs/attachments.js")
require("./logic/index.js")
require("./models/index.js")
require("./world/index.js")
var interaction = require("./interaction/index.js")
var Account = require("./models/account.js")
require("./development/devtools.js")


//let acc = new Account(undefined);
//acc.register("nigga","gay","test@asf.de");
//acc.login("nigga","gay");

mp.events.add("playerReady", player => {
	player.call("server:account:init");
});


