


mp.events.add("client:account:login", (player,username,password) => {

	// TODO
	player.dimension = 0;
	console.log(username,password)




	// register



	//-133.6523895263672, -2378.825439453125, 15.16739273071289, 353.6697692871094




	player.position = new mp.Vector3(-133.6523895263672, -2378.825439453125, 15.16739273071289);
	player.heading =  353.6697692871094
	player.call("server:intro:start");

});