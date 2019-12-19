var EventEmitter = require('events').EventEmitter;
class Interaction extends EventEmitter {
	constructor(x = 0,y = 0,z = 0,dim = 0,range=0,enterCb = () => {},leaveCb = () => {}) {
		super();
		this.position = new mp.Vector3(x,y,z);
		this.dim = dim;
		this.range = range;

		this.enterCallback = enterCb;
		this.leaveCallback = leaveCb;


		this.colshape = mp.colshapes.newSphere(x, y, z, range, dim);
		this.enterEvent =  new mp.Event('playerEnterColshape', (player, shape) => {
			if (shape != this.colshape) return;

			this.enter(player);
		});
		this.leaveEvent =  new mp.Event('playerExitColshape', (player, shape) => {
			if (shape != this.colshape) return;

			this.leave(player);
		});
		console.log("new interaction shape");
	}
	kill() {
		console.log("remove element");
		this.leaveEvent.destroy();
		this.enterEvent.destroy();
		console.log(this.colshape);
		this.colshape.destroy();

	}
	enter(player) {
		console.log("enter colshape");

		this.enterCallback(player);
	}
	leave(player) {
		console.log("leave colshape");
		this.leaveCallback(player);

	}

}


module.exports = Interaction;