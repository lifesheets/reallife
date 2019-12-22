
var Animations = require("../libs/animations.js");
var Interaction = require("../interaction");
mp.events.add("client:interaction:receive",(player,key) => {
	player.interface.interact(key);
})
mp.events.add("client:appearance:save", (player, data) => {
	if (player.interface) {
		player.interface.appearance.saveData(data);
		player.interface.appearance.load();

		if (player.interface.state == "register") {

			//server:objects:create", (identifier,model,x,y,z,rx,ry,rz

			//"xm_prop_x17_bag_01a",{"x":-137.4462,"y":-2377.6685,"z":14.1563},{"x":0,"y":0,"z":-17.2}


			player.call("server:objects:create", ["bag_register","xm_prop_x17_bag_01a",-137.4462,-2377.6685,14.1563,0,0,-17.2]);





			let interaction_bag;
			let interact_event;
			let enterFunc = (player) => {
				console.log("bag entered");

				player.call("server:interaction:request", [70, "Tasche durchsuchen", 500]);
				player.interface.once("interact", interact_event = key => {
					interaction_bag.kill();
					console.log("pickup done");
					player.interface.playAnimSync(Animations.getAnim("Drop").dict, Animations.getAnim("Drop").name,  16.0, 1, -1,  49, 1.0, false, false, false,1000);
					player.call("server:objects:delete", ["bag_register"]);
				})
			};
			let leaveFunc = (player) => {
				console.log("bag left");
				player.call("server:interaction:cancelrequest",[70]);
				player.interface.off("interact",interact_event)
			};

			interaction_bag = new Interaction(-137.53456115722656, -2377.543212890625, 15.397653579711914,0,1,enterFunc,leaveFunc);






		}
	}
});