var Animations = require("../libs/animations.js");
mp.events.add("client:account:login", (player, username, password) => {
	// TODO
	console.log("login", username, password)
	// register
	//-133.6523895263672, -2378.825439453125, 15.16739273071289, 353.6697692871094
	//player.position = new mp.Vector3(-133.6523895263672, -2378.825439453125, 15.16739273071289);
	//player.heading =  353.6697692871094
	//player.interface.state = "register";
	/*player.interface.account.register(username, password, "testmail" + (Math.random() * 100) + "@test.de").then(e => {
		console.log("e", e);
	}).catch(e => {
		console.log("err", e);
	})*/
	player.interface.account.login(username, password).then(e => {
		//console.log("e", e);
		player.call("server:game:start");
		player.interface.vehicles.load();
		player.interface.spawn();
	}).catch(e => {
		console.log("err", e);
		player.call("server:account:msg", [{
			title: "Account",
			titleSize: "16px",
			message: e,
			messageColor: 'rgba(0,0,0,.8)',
			position: "bottomCenter",
			color: 'rgba(212,212,212, 0.8)',
			progressBarColor: 'rgba(136, 48, 255, 0.6)',
			close: false
		}]);
	})
	//player.call("server:game:start");
	//player.interface.spawn();
});
mp.events.add("client:account:register", (player, username, password, email) => {
	console.log("username,password,email", username, password, email);
	player.interface.account.register(username, password, email).then(e => {
		//console.log("e", e);
		player.interface.state = "register";
		player.dimension = e.uid;
		player.call("server:intro:start");
	}).catch(e => {
		player.call("server:account:msg", [{
			title: "Account",
			titleSize: "16px",
			message: "Account existiert bereits (eMail oder Username)",
			messageColor: 'rgba(0,0,0,.8)',
			position: "bottomCenter",
			color: 'rgba(212,212,212, 0.8)',
			progressBarColor: 'rgba(136, 48, 255, 0.6)',
			close: false
		}]);
		console.log("err", e);
	})
});
mp.events.add("client:interaction:receive", (player, key) => {
	player.interface.interact(key);
})
