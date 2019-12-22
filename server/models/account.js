var EventEmitter = require('events').EventEmitter;
var AccountDB = require("../database").account;
var Op = require("../database").Op;
var bcrypt = require('bcrypt');
const saltSecurity = 15;
class Account extends EventEmitter {
	constructor(player) {
		super();
		this.player = player;
	}
	async login(username, password) {
		AccountDB.findOne({
			where: {
				username: [Op.or]: [{
					username: username
				}, {
					email: email
				}]
			}
		}).then(pAccount => {
			console.log("Account exists and found",pAccount);

		}).catch(err => {
			console.log("[ERR]Account not exists",err);
		})
	}
	async register(username, password, email) {
		AccountDB.findOne({
			where: {
				username: [Op.or]: [{
					username: username
				}, {
					email: email
				}]
			}
		}).then(pAccount => {
			console.log("Account does exists",pAccount);

		}).catch(err => {
			console.log("[ERR]Account does not exists",err);

			bcrypt.hash(password, saltSecurity).then((pwHash) => {
				// Store hash in your password DB.
				console.log("pwHash",pwHash);
			}).catch((err) => {
				console.log("[ERR]Bcrypt Hash failed")
			})


		})

	}
}
module.exports = Account;