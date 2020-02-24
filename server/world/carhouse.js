var Interaction = require("../interaction");
var showCar1 = mp.vehicles.new(mp.joaat("primo2"), new mp.Vector3(-99.99, -1132.83, 27.92), {
    numberPlate: "test",
    color: [
        [150, 10, 0],
        [150, 10, 0]
    ]
});
showCar1.locked = true;
showCar1.setVariable("showCar", true);
var showCar2 = mp.vehicles.new(mp.joaat("superd"), new mp.Vector3(-96.99, -1127.83, 27.92), {
    numberPlate: "test",
    color: [
        [150, 10, 0],
        [150, 10, 0]
    ]
});
showCar2.setVariable("showCar", true);
var showCar3 = mp.vehicles.new(mp.joaat("picador"), new mp.Vector3(-92.99, -1123.83, 27.92), {
    numberPlate: "test",
    color: [
        [150, 10, 0],
        [150, 10, 0]
    ]
});
showCar3.locked = true;
showCar3.setVariable("showCar", true);