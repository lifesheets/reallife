let items_count = 0;
var items = {
	WEAPON_M4: items_count++,
	FOOD_MELON: items_count++,
	KEY_VEHICLE: items_count++,
	KEY_PROPERTY: items_count++,
	CLOTHING_JACKET: items_count++
}
Object.keys(items).forEach(function(key, value) {
	global[key] = items[key];
})
var names = {
	"WEAPON_M4": WEAPON_M4,
	"FOOD_MELON": FOOD_MELON,
	"KEY_PROPERTY": KEY_PROPERTY,
	"KEY_VEHICLE": KEY_VEHICLE,
	"JACKET": CLOTHING_JACKET,
}

let classes_count = 0;
const c = {
	WEAPON: classes_count++,
	FOOD: classes_count++,
	KEYS: classes_count++,
	CLOTHING: classes_count++
}

Object.keys(c).forEach(function(key, value) {
	global[key] = c[key];
})
var classGroups = {
	[c.WEAPON]: [WEAPON_M4],
	[c.FOOD]: [FOOD_MELON],
	[c.KEYS]:[KEY_PROPERTY,KEY_VEHICLE],
	[c.CLOTHING]:[CLOTHING_JACKET]
}
var weights = [];
weights[WEAPON_M4] = 1.3;
weights[FOOD_MELON] = 0.2;
weights[KEY_PROPERTY] = 0.1;
weights[KEY_VEHICLE] = 0.1;
weights[CLOTHING_JACKET] = 0.2;


var unique_items = [c.KEYS,c.WEAPON]

function getWeight(item) {
	return weights[item] || 1;
}
function isClassUnique(classs) {
	return unique_items.indexOf(classs) > -1;
}
c.getClass = function(itemid) {
	return Object.keys(classGroups).find(e => {
		return classGroups[e].indexOf(itemid) > -1;
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
	classes: c,
	names: names,
	weights: getWeight,
	unique: isClassUnique,
};