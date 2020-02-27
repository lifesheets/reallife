let items_count = 0;
var items = {
	WEAPON_M4: items_count++,
	FOOD_MELON: items_count++,
	KEY_VEHICLE: items_count++,
	KEY_PROPERTY: items_count++
}
Object.keys(items).forEach(function(key, value) {
	global[key] = items[key];
})
var names = {
	"WEAPON_M4": WEAPON_M4,
	"FOOD_MELON": FOOD_MELON,
	"KEY_PROPERTY": KEY_PROPERTY,
	"KEY_VEHICLE": KEY_VEHICLE,
}
var classes = {
	"Waffen": [WEAPON_M4],
	"Nahrung": [FOOD_MELON],
	"Schlüssel":[KEY_PROPERTY,KEY_VEHICLE]
}
var weights = [];
weights[WEAPON_M4] = 1.3;
weights[FOOD_MELON] = 0.2;
weights[KEY_PROPERTY] = 0.1;
weights[KEY_VEHICLE] = 0.1;


var unique_items = ["Waffen","Schlüssel"]

function getWeight(item) {
	return weights[item] || 1;
}
function isClassUnique(classs) {
	return unique_items.indexOf(classs) > -1;
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
	return names.find((e, i) => {
		return i == name;
	});
}
module.exports = {
	items: items,
	classes: classes,
	names: names,
	weights: getWeight,
	unique: isClassUnique,
};