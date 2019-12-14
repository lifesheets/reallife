





var Player = class {
	constructor(player) {


	}
}








mp.Player.prototype.__defineGetter__("interface", function() {
    if (!this.interface_class)
        this.interface_class = new Player(this);

    return this.interface_class;
});




