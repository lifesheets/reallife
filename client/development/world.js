var marker_data = [];

function drawMarker(id) {
	let rhouse = marker_data[id];
	if (!rhouse) return;
	let z = mp.game.gameplay.getGroundZFor3dCoord(rhouse.x, rhouse.y, rhouse.z, 0, false);
	let color = rhouse.colorMarker;
	let textcolor = rhouse.colorText;
	let rotate = rhouse.rotate;
	let text = rhouse.text;
	mp.game.graphics.drawMarker(rhouse.marker, rhouse.x, rhouse.y, z + rhouse.offset, 0, 0, 0, 0, 0, 0, 1.2, 1.2, 1.2, color[0], color[1], color[2], color[3], false, false, 2, rotate, "", "", false);
	if ((rhouse.dollar)) {
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


	if (mp.raycasting.testCapsule(mp.players.local.position, new mp.Vector3(rhouse.x, rhouse.y, rhouse.z), 0.1,mp.players.local.handle, 1)) return;
	if (size < 0.07) return;





	mp.game.graphics.setDrawOrigin(rhouse.x, rhouse.y, z + 1.53, 0);
	mp.game.graphics.drawText(text, [0, 0], {
		font: rhouse.font,
		color: textcolor,
		scale: [size, size],
		outline: true,
		centre: true
	});
	mp.game.graphics.clearDrawOrigin()
}
mp.events.add("server:world:enablemarker", (id, data) => {
	if (marker_data[id]) return;
	//render_house = JSON.parse(data);
	marker_data[id] = JSON.parse(data);
	marker_data[id].event = new mp.Event('render', () => {
		drawMarker(id);
	});
});
mp.events.add("server:world:disablemarker", (id) => {
	if (!marker_data[id]) return;
	marker_data[id].event.destroy();
	marker_data[id] = undefined;
	delete marker_data[id];
});