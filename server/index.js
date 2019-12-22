
var db = require("./database");
require("./libs/attachments.js")
require("./logic/index.js")
require("./models/index.js")
require("./world/index.js")
var interaction = require("./interaction/index.js")


mp.events.add("playerReady", player => {
	player.call("server:account:init");
});