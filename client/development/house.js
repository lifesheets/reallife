var house_data = [];

function draweState(id) {
	let rhouse = house_data[id];
	if (!rhouse) return;
	let z = mp.game.gameplay.getGroundZFor3dCoord(rhouse.x, rhouse.y, rhouse.z, 0, false);
	let color = [10, 160, 10, 110];
	if (rhouse.price != 0) color = [255, 143, 5, 110];
	if (rhouse.locked) color = [160, 10, 10, 110]
	let marker = 25;
	let offset = 0.01;
	let rotate = false;
	let scaleZ = 1.2;
	let name = "Haus"
	if (rhouse.type == "business") {
		marker = 20;
		offset = 0.7;
		rotate = true;
		color = [10, 160, 10, 100];
		name = rhouse.name;
	} else if (rhouse.type == "public") {
		marker = 1;
		offset = 0;
		color = [255, 143, 5, 100]
		scaleZ = 0.7;
		name = rhouse.name
	}
	mp.game.graphics.drawMarker(marker, rhouse.x, rhouse.y, z + offset, 0, 0, 0, 0, 0, 0, 1.2, 1.2, scaleZ, color[0], color[1], color[2], color[3], false, false, 2, rotate, "", "", false);
	if ((rhouse.price != 0) && (rhouse.owner == "") && (rhouse.type == "house")) {
		mp.game.graphics.drawMarker(29, rhouse.x, rhouse.y, z + 0.4, 0, 0, 0, 0, 0, 0, 0.7, 0.7, 0.7, 25, 201, 2, 60, false, false, 2, true, "", "", false);
	}
	let dist = mp.game.system.vdist2(rhouse.x, rhouse.y, rhouse.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
	let c_dist = 1 / 250 * dist;
	let size = mp.lerp(0.4, 0.06, c_dist)
	if (size > 0.4) {
		size = 0.4;
	} else if (size < 0.06) {
		size = 0.06;
	}


	if (mp.raycasting.testPointToPoint(mp.players.local.position, new mp.Vector3(rhouse.x, rhouse.y, rhouse.z), mp.players.local, 1)) return;
	if (size < 0.07) return;





	mp.game.graphics.setDrawOrigin(rhouse.x, rhouse.y, z + 1.53, 0);
	mp.game.graphics.drawText(name, [0, 0], {
		font: 4,
		color: [255, 255, 255, 200],
		scale: [size, size],
		outline: true,
		centre: true
	});
	mp.game.graphics.clearDrawOrigin()
	if ((rhouse.price != 0) && (rhouse.owner == "") && (rhouse.type == "house")) {
		mp.game.graphics.setDrawOrigin(rhouse.x, rhouse.y, z + 1.35, 0);
		mp.game.graphics.drawText("$" + rhouse.price, [0, 0], {
			font: 4,
			color: [255, 255, 255, 200],
			scale: [size * 0.7, size * 0.7],
			outline: true,
			centre: true
		});
		mp.game.graphics.clearDrawOrigin()
	}
	if ((rhouse.type == "house") && (rhouse.owner != "")) {
		mp.game.graphics.setDrawOrigin(rhouse.x, rhouse.y, z + 1.2, 0);
		mp.game.graphics.drawText(rhouse.locked ? "Verschlossen" : "Offen", [0, 0], {
			font: 4,
			color: [255, 255, 255, 200],
			scale: [size * 0.7, size * 0.7],
			outline: true,
			centre: true
		});
		mp.game.graphics.clearDrawOrigin()
	}
}
mp.events.add("server:estate:enablemarker", (id, data) => {
	if (house_data[id]) return;
	//render_house = JSON.parse(data);
	house_data[id] = JSON.parse(data);
	house_data[id].event = new mp.Event('render', () => {
		draweState(id);
	});
});
mp.events.add("server:estate:disablemarker", (id) => {
	if (!house_data[id]) return;
	house_data[id].event.destroy();
	house_data[id] = undefined;
	delete house_data[id];
});