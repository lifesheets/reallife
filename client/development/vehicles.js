var CEFHud = require("./browser.js").hud;
var isTachoVisible = false;
mp.events.add('entityStreamIn', (entity) => {
    //const isInvincible = entity.getVariable('isInvincible');
    //entity.setInvincible(!!isInvincible);
    if (entity.type !== 'vehicle') return;
    entity.setDirtLevel(entity.getVariable('dirt_level'));
});
mp.events.addDataHandler("dirt_level", (entity, value) => {
    if (entity.type !== 'vehicle') return;
    entity.setDirtLevel(value);
});
var updateThreshold = 500;
var last_pos = null;
var kmCounter = 0;
var kmTotal = 0;
var lastSpeed = 0;
mp.events.add("render", () => {
    // tacho
    if (mp.cache["hud_ready"]) {
        if (mp.players.local.isInAnyVehicle(false)) {
            let speed = (mp.players.local.vehicle.getSpeed() * 3.6).toFixed(10);
            //if (lastSpeed != speed) {

                CEFHud.call("drawTacho", speed, mp.players.local.vehicle.getHeading());
                isTachoVisible = true;
              //  lastSpeed = speed;
            //}
            //return;
        } else {
            if (isTachoVisible) {
                //CEFHud.call("clearTacho");
                isTachoVisible = false;
            }
        }
    }
    let localVeh = mp.players.local.vehicle;
    var self = this;
    if (localVeh) {
        if ((localVeh.getPedInSeat(-1) == mp.players.local.handle)) {
            let veh_model = localVeh.model;
            if (last_pos == null) last_pos = mp.players.local.position;
            let cPos = mp.players.local.position;
            let dist = mp.game.system.vdist(cPos.x, cPos.y, cPos.z, last_pos.x, last_pos.y, last_pos.z) ;
            self.pos = cPos;
            if (dist < 7500 && dist > 0) { // !! Anpassen damit es nicht mehr so schnell hoch springt !!
                kmTotal += dist;
                kmCounter += dist;
                if (kmCounter >= updateThreshold) {
                    console.log("update km count", kmCounter);
                    mp.events.callRemote("client:vehicle:update", parseFloat(kmCounter));
                    kmCounter = 0;
                }
            }
            last_pos = cPos;
        }
    }
    if (localVeh) {
        mp.game.graphics.drawText("DIRT" + localVeh.getVariable('dirt_level'), [0.5, 0.75 ], {
            font: 4,
            color: [255, 255, 255, 200],
            scale: [0.4, 0.4],
            outline: true
        });
    }

});
var seats = {
    0: "seat_pside_f", // passanger side front
    1: "seat_dside_r", // driver side rear
    2: "seat_pside_r", // passanger side rear
    3: "seat_dside_r1", // driver side rear1
    4: "seat_pside_r1", // passanger side rear1
    5: "seat_dside_r2", // driver side rear2
    6: "seat_pside_r2", // passanger side rear2
    7: "seat_dside_r3", // driver side rear3
    8: "seat_pside_r3", // passanger side rear3
    9: "seat_dside_r4", // driver side rear4
    10: "seat_pside_r4", // passanger side rear4
    11: "seat_dside_r5", // driver side rear5
    12: "seat_pside_r5", // passanger side rear5
    13: "seat_dside_r6", // driver side rear6
    14: "seat_pside_r6", // passanger side rear6
    15: "seat_dside_r7", // driver side rear7
    16: "seat_pside_r7", // passanger side rear7
}
mp.game.controls.useDefaultVehicleEntering = false;
mp.keys.bind(0x47, false, () => {
    if (mp.players.local.vehicle === null) {
        if (mp.gui.cursor.visible) return;
        let pos = mp.players.local.position;
        let targetVeh = {
            veh: null,
            dist: 900
        }
        // get closest veh + police cars
        mp.vehicles.forEachInStreamRange((veh) => {
            let vp = veh.position;
            let dist = mp.game.system.vdist2(pos.x, pos.y, pos.z, vp.x, vp.y, vp.z);
            if (dist < targetVeh.dist) {
                targetVeh.dist = dist;
                targetVeh.veh = veh;
            }
        });
        let veh = targetVeh.veh;
        if (veh !== null) {
            if (veh.isAnySeatEmpty()) {
                let toEnter = {
                    seat: 0,
                    dist: 99999,
                    pos: new mp.Vector3(0, 0, 0)
                }
                let insideSeatsFree = false;
                let ground;
                let seats_count = mp.game.vehicle.getVehicleSeats(veh);
                for (var i = 0; i <= seats_count; i++) {
                    if (veh.isSeatFree(i)) {
                        if (i <= 2) {
                            insideSeatsFree = true;
                        }
                        let seat = seats[i];
                        let seat_pos = veh.getWorldPositionOfBone(veh.getBoneIndexByName(seat))
                        let ground_pos = mp.game.gameplay.getGroundZFor3dCoord(seat_pos.x, seat_pos.y, seat_pos.z, 0, false);
                        let seat_dist = mp.game.system.vdist2(pos.x, pos.y, pos.z, seat_pos.x, seat_pos.y, seat_pos.z);
                        if ((i > 2) && (insideSeatsFree == true)) {} else {
                            if (veh.model == 1917016601 && i > 0) {
                                if ((toEnter.dist > 30)) {
                                    toEnter.dist = 30;
                                    toEnter.seat = i;
                                }
                            }
                            if ((seat_dist < toEnter.dist)) {
                                toEnter.dist = seat_dist;
                                toEnter.seat = i;
                            }
                        }
                    }
                }
                if ((veh.model == 1475773103) && (toEnter.seat > 0)) { // if rumpo3
                    mp.players.local.taskEnterVehicle(veh.handle, 5000, toEnter.seat, 2.0, 16, 0);
                } else {
                    mp.players.local.taskEnterVehicle(veh.handle, 5000, toEnter.seat, 2.0, 1, 0);
                }
            }
        }
    }
});