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


var weights = [];
weights[WEAPON_M4] = 1.3;
weights[FOOD_MELON] = 0.2;

function getWeight(item) {
	return weights[item] || 1;
}


classes.getClass = function(itemid) {

	return Object.keys(classes).find(e => {
		return classes[e].indexOf(itemid) > -1;
	});
}
names.getName = function(item) {
	return Object.keys(names).find(e => {
		return names[e] == item.itemid;
	});
}
names.getID = function(name) {
	return names.find((e,i) => {
		return i == name;
	});
}
module.exports = {items:items,classes:classes,names:names,weights:getWeight};