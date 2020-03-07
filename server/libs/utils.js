var _getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.timeout = (interval = 1000, checkFunc, max = 10000) => {
	return new Promise((resolve, reject) => {
		var started = Date.now();
		var timer = setInterval(() => {
			let re = checkFunc();
			if (re) {
				clearInterval(timer);
				return resolve();
			};
			if (started+max > Date.now()) {
				clearInterval(timer);
				return reject();
			}

		}, interval);
	})
}
module.exports.getUID = function* () {
	console.log("getUID generator init");
	var id_count = 0;
	while (true) {
		id_count += 1;
		yield id_count;
	}
}()
var key_cache = [];
function* getKeyID() {
	while (true) {
		var id = "";
		do {
			let ts = Date.now().toString();
			var parts = ts.split("").reverse();
			for (var i = 0; i < parts.length; ++i) {
				var index = _getRandomInt(0, parts.length - 1);
				id += parts[index];
			}
		} while (key_cache[id]);
		key_cache[id] = true;
		yield id;
	}
}
getKeyID.prototype.add = (id)=> {
	key_cache[id] = true;
	return key_cache[id];
};
module.exports.getKeyID = getKeyID();