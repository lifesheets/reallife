var EventEmitter = require('events').EventEmitter;
var AccountDB = require("../database").account;
var Op = require("../database").Op;
//var bcrypt = require('bcrypt');
const saltSecurity = 15;
class Account extends EventEmitter {
	constructor(player) {
		super();
		this.player = player;
	}
	async login(username, password) {
		AccountDB.findOne({
			where: {
				username: username
			}
		}).then(pAccount => {
			//console.log("Account exists and found",pAccount);
			if (pAccount == null) {
				console.log("account not exists", pAccount);
			} else {
				console.log("account exists", pAccount);
			}
		}).catch(err => {
			console.log("[ERR]Error", err);
		})
	}
	async register(username, password, email) {
		return new Promise((resolve, reject) => {
			AccountDB.findOne({
				where: {
					[Op.or]: [{
						username: username
					}, {
						email: email
					}]
				}
			}).then(pAccount => {
				if (pAccount == null) {
					if (!this.player.serial) return reject("serial not valid");
					if (!this.player.rgscId) return reject("rgscId not valid");

					console.log("account not exists", pAccount);
					AccountDB.create({
						username: username,
						password: password,
						email: email,
						hwid: this.player.serial,
						rgscId: this.player.rgscId
					}).then((e) => {
						console.log("Account created", e);
						return resolve(e.dataValues);
					}).catch((err) => {
						console.log("Error Creating account",err);
						return reject(err);
					})
				} else {
					console.log("account exists", pAccount);
					return reject("account already exists");
				}
			}).catch(err => {
				console.log("[ERR]Err", err);
				/*bcrypt.hash(password, saltSecurity).then((pwHash) => {

					console.log("pwHash",pwHash);
				}).catch((err) => {
					console.log("[ERR]Bcrypt Hash failed")
				})*/
				return reject(err);
			})
		})
	}
}
module.exports = Account;