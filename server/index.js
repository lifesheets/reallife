require("./account/index.js")
var mysql = require("./libs/mysql.js");



mp.events.add("playerReady", player => {
	player.spawn(new mp.Vector3(1240.9813232421875, -2998.3310546875, 12.331292152404785));
	player.model = mp.joaat('mp_m_freemode_01');
	player.heading = -90;
	player.alpha = 255;
	player.dimension = -15;



	player.call("server:account:init");
});