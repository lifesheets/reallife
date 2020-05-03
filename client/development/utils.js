// https://github.com/glitchdetector/fivem-minimap-anchor
function getMinimapAnchor() {
    let sfX = 1.0 / 20.0;
    let sfY = 1.0 / 20.0;
    let safeZone = mp.game.graphics.getSafeZoneSize();
    let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
    let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    let scaleX = 1.0 / resolution.x;
    let scaleY = 1.0 / resolution.y;
    let minimap = {
        width: scaleX * (resolution.x / (4 * aspectRatio)),
        height: scaleY * (resolution.y / 5.674),
        scaleX: scaleX,
        scaleY: scaleY,
        leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
        bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
    };
    minimap.rightX = minimap.leftX + minimap.width;
    minimap.topY = minimap.bottomY - minimap.height;
    return minimap;
}
var vector3_cache = [];
function vector3_avg(vector, identifier, range = 25) {
    if (!vector3_cache[identifier]) vector3_cache[identifier] = [];
    vector3_cache[identifier].push(vector);
    if (vector3_cache[identifier].length > range) {
        let vector3_avg = vector3_cache[identifier].reduce((cur,acc) => {
            acc.x += cur.x;
            acc.y += cur.y;
            acc.z += cur.z;
            return acc;
        },new mp.Vector3(0,0,0));

        vector3_cache[identifier].splice(0);
        return new mp.Vector3(vector3_avg.x/range,vector3_avg.y/range,vector3_avg.z/range);
    }
    return vector;
}
module.exports = {
    minimap_anchor: getMinimapAnchor,
    vector3_avg: vector3_avg
}