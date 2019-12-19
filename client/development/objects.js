
class objCreator {
    constructor(model, position, rotation, dim = 0) {
        let self = this;
        this.obj = undefined;
        this.model = model;
        this.position = mp.vector(position);
        this.rotation = mp.vector(rotation);
        this.created = false;
        this.dim = dim;
        setImmediate(function() {
            self.create();
        })
    }
    get id() {
        return this.obj != undefined ? this.obj.id : -1;
    }
    create() {
        let self = this;
        if (this.created == false) {
            try {
                mp.game.streaming.requestModel(mp.game.joaat(this.model));
                if (mp.game.streaming.hasModelLoaded(mp.game.joaat(this.model))) {
                    this.obj = mp.objects.new(mp.game.joaat(this.model), this.position, {
                        rotation: this.rotation,
                        alpha: 255,
                        dimension: this.dim
                    });
                    this.created = true;
                } else {
                    setTimeout(function() {
                        self.create()
                    }, 1000)
                }
            } catch (err) {
                console.log(err);
            }
        }
        return this.created;
    }
    get handle() {
        return (this.created == 1) ? this.obj.handle : -1;
    }
    delete() {
        if (typeof this.obj != "object") return;
        this.obj.markForDeletion();
        this.obj.destroy();
    }
}
var clientSideObjects = [];
mp.events.add("server:objects:create", function(identifier,model,x,y,z,rx,ry,rz) {
    clientSideObjects[identifier] = new objCreator(model,{"x":x,"y":y,"z":z},{"x":rx,"y":ry,"z":rz},mp.players.local.dimension);
});
mp.events.add("server:objects:delete", function(identifier) {
    if (!clientSideObjects[identifier]) return;

    console.log("delete",identifier)
    clientSideObjects[identifier].delete();
});


module.exports = objCreator;