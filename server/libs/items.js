let items_count = 0;
var items = {
    WEAPON_M4:items_count++,
    FOOD_MELON:items_count++
}

Object.keys(items).forEach(function(key, value) {
	global[key] = items[key];
})

var names = {
	"M4 Sturmgewehr": WEAPON_M4,
}
var classes = {
	"Waffen": [WEAPON_M4],
	"Nahrung": [FOOD_MELON],
}
classes.getClass = function(item) {
	return 0
}
module.exports = {items:items,classes:classes};