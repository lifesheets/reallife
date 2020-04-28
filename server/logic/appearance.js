mp.events.add("client:appearance:save", (player, data) => {
	if (player.interface) {
		player.interface.appearance.saveData(data);
		if (player.interface.state == "register") {
			player.interface.spawn();
		}
	}
});