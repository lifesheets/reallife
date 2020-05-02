let items_count = 0;
var items = {
    WEAPON_M4: items_count++,
    FOOD_MELON: items_count++,
    KEY_VEHICLE: items_count++,
    KEY_PROPERTY: items_count++,
    CLOTHING_JACKET: items_count++
}
global["ITEM"] = [];
Object.keys(items).forEach(function(key, value) {
    console.log("enums-> ITEM." + key, "=", items[key])
    global["ITEM"][key] = items[key];
})
var names = {
    "WEAPON_M4": ITEM.WEAPON_M4,
    "FOOD_MELON": ITEM.FOOD_MELON,
    "KEY_PROPERTY": ITEM.KEY_PROPERTY,
    "KEY_VEHICLE": ITEM.KEY_VEHICLE,
    "JACKET": ITEM.CLOTHING_JACKET,
}
let classes_count = 0;
const c = {
    WEAPON: classes_count++,
    FOOD: classes_count++,
    KEYS: classes_count++,
    CLOTHING: classes_count++
}
global["ITEMCLASS"] = [];
Object.keys(c).forEach(function(key, value) {
    console.log("enums-> ITEMCLASS." + key, "=", c[key])
    global["ITEMCLASS"][key] = c[key];
})
var classGroups = {
    [ITEMCLASS.WEAPON]: [ITEM.WEAPON_M4],
    [ITEMCLASS.FOOD]: [ITEM.FOOD_MELON],
    [ITEMCLASS.KEYS]: [ITEM.KEY_PROPERTY, ITEM.KEY_VEHICLE],
    [ITEMCLASS.CLOTHING]: [ITEM.CLOTHING_JACKET]
}
const getClass = function(itemid) {
    return parseInt(Object.keys(classGroups).find(e => {
        return classGroups[e].indexOf(itemid) > -1;
    }));
}
var weights = [];
weights[ITEM.WEAPON_M4] = 1.3;
weights[ITEM.FOOD_MELON] = 0.2;
weights[ITEM.KEY_PROPERTY] = 0.1;
weights[ITEM.KEY_VEHICLE] = 0.1;
weights[ITEM.CLOTHING_JACKET] = 0.2;

function getWeight(item) {
    return weights[item] || 1;
}
var unique_items = [ITEMCLASS.WEAPON, ITEMCLASS.KEYS];

function isClassUnique(classs) {
    return unique_items.indexOf(classs) > -1;
}
const getName = function(item) {
    return Object.keys(names).find(e => {
        return names[e] == item.itemid;
    });
}
const getID = function(name) {
    return names.find((e, i) => {
        return i == name;
    });
}
let type_count = 0;
const _types = {
    PLAYER: type_count++,
    PROPERTY: type_count++,
    GLOBAL: type_count++,
    FACTION: type_count++
}
global["TYPE"] = [];
Object.keys(_types).forEach(function(key, value) {
    console.log("enums-> TYPE." + key, "=", _types[key])
    global["TYPE"][key] = _types[key];
})
module.exports = {
    items: items,
    getClass: getClass,
    getName: getName,
    getIDByName: getName,
    weights: getWeight,
    unique: isClassUnique,
    ownerTypes: _types,
};