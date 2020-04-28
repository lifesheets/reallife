var EventEmitter = require('events').EventEmitter;



class LogManager extends EventEmitter {
	constructor(namespace,name) {
		super();
		this.namespace = namespace;
		this.name = name;

		this.init();
	}
	log(event,...args){
		args = args.map(e => {

			if ((typeof e == "object")) {
				e = JSON.stringify(e);
			}
			return e;
		});
		console.log(event,"["+this.namespace+"]<"+this.name+">",args.join(" "));
	}
	init() {
		this.log("Server:LogManager:Init");
	}
}
module.exports = LogManager;