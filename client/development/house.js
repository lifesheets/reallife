var render_house = undefined;
mp.events.add("render", () => {
	if (render_house == undefined) return;
	mp.game.graphics.drawMarker(28, render_house.x, render_house.y, render_house.z, 0, 0, 0, 0, 0, 0, 1, 1, 1, 36, 214, 42, 200, true, false, 2, false, "", "", false);
});
mp.events.add("server:estate:enablemarker", (data) => {
	render_house = JSON.parse(data);
});
mp.events.add("server:estate:disablemarker", () => {
	render_house = undefined;
});