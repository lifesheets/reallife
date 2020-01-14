"use strict";



/*



*/

var Bones = require("./libs/skeleton.js")
console.log = function(...a) {
	a = a.map(function(e) {
		return JSON.stringify(e);
	})
	mp.gui.chat.push("DeBuG:" + a.join(" "))
};
mp.lerp = function(a, b, n) {
	return (1 - n) * a + n * b;
}
mp.cache = [];
let utils = require("./utils.js")
require("./natives.js")
require("./libs/attachments.js")
require("./libs/weapon_attachments.js")
/*Register Attachments for Player Animatiuons etc TODO*/
require("./vector.js")
mp.attachmentMngr.register("mining", "prop_tool_pickaxe", Bones.SKEL_R_Hand, new mp.Vector3(0.085, -0.3, 0), new mp.Vector3(-90, 0, 0));
mp.attachmentMngr.register("lumberjack", "w_me_hatchet", Bones.SKEL_R_Hand, new mp.Vector3(0.085, -0.05, 0), new mp.Vector3(-90, 0, 0));
mp.attachmentMngr.register("drink_beer", "prop_cs_beer_bot_03", Bones.SKEL_L_Hand, new mp.Vector3(0.1, -0.03, 0.025), new mp.Vector3(-90, 30, 0));
mp.attachmentMngr.register("eat_burger", "prop_cs_burger_01", Bones.SKEL_L_Hand, new mp.Vector3(0.15, 0.025, 0.025), new mp.Vector3(170, 40, 0));
mp.isValid = function(val) {
	return val != null && val != undefined && val != "";
}
mp.gui.chat.enabled = false;
mp.gui.execute("const _enableChatInput = enableChatInput;enableChatInput = (enable) => { mp.trigger('chatEnabled', enable); _enableChatInput(enable) };");
mp.events.add('chatEnabled', (isEnabled) => {
	mp.gui.chat.enabled = isEnabled;
});
mp.gameplayCam = mp.cameras.new('gameplay');
mp.defaultCam = mp.cameras.new('default');
mp.ui = {};
mp.ui.ready = false;
mp.loggedIn = false;
mp.gameplayCam.setAffectsAiming(true);
require("./character_creator.js")
require("./login.js")
require("./hud.js")
require("./vehicles.js")
require("./animations.js")
require("./nametags.js")
var natives = require("./natives.js")
var CEFNotification = require("./browser.js").notification;
mp.events.add("Notifications:New", (notification_data) => {
	CEFNotification.call("notify", notification_data)
})



