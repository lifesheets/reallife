mp.nametags.enabled = false;
mp.gui.chat.colors = true;


mp.events.add('render', (nametags) => {
    let startPosition = mp.players.local.getBoneCoords(12844, 0, 0, 0);
    if ((mp.players.local.getVariable("spawned") == true) && (mp.players.local.getVariable("death") == false)) {
        mp.players.forEachInStreamRange((player) => {
           // if (player != mp.players.local) {
                if (mp.game.system.vdist2(startPosition.x, startPosition.y, startPosition.z, player.position.x, player.position.y, player.position.z) < 400) {
                    if ((player.getVariable("spawned") == true)) {
                        let endPosition = player.getBoneCoords(12844, 0, 0, 0);
                        let hitData = mp.raycasting.testPointToPoint(startPosition, endPosition, mp.players.local, (1 | 16 | 256));
                        if (!hitData) {
                            let color = [200, 200, 200, 255];

                            let lPos = mp.players.local.position;
                            let pos = player.getWorldPositionOfBone(player.getBoneIndexByName("IK_Head"));
                            pos.z += 0.4;
                            let dist = mp.game.system.vdist2(lPos.x, lPos.y, lPos.z, pos.x, pos.y, pos.z);
                            let c_dist = 1 / 400 * dist;
                            let size = mp.lerp(0.4, 0.06, c_dist)
                            if (size > 0.4) {
                                size = 0.4;
                            } else if (size < 0.06) {
                                size = 0.06;
                            }
                            let playerName = player.name;
                            if (player.getVariable('playerName') != null) {
                                playerName = player.getVariable('playerName');
                            }

                            mp.game.graphics.setDrawOrigin(pos.x, pos.y, pos.z, 0);
                            mp.game.graphics.drawText(playerName, [0, 0], {
                                font: 4,
                                color: color,
                                scale: [size, size],
                                outline: true
                            });
                            mp.game.graphics.clearDrawOrigin()
                        }
                    }
               // }
            }
        })
    }
})