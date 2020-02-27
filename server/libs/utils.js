module.exports.timeout = (interval = 1000, checkFunc, max = 10000) => {
	return new Promise((resolve, reject) => {
		var started = Date.now();
		var timer = setInterval(() => {


			console.log("check");
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