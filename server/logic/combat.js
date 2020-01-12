



















mp.events.add('playerDeath', (player) => {
	if (player.interface)
		player.interface.death();


});