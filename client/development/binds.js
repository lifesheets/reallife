class Binds{
	 constructor(event,key) {
	 	this.key = key;
	 	this.event = event;

	 	mp.keys.bind(this.key, false, () => {
		    mp.events.call(this.event);
		});
	 }
}
module.exports = Binds;