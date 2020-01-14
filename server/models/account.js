var EventEmitter = require('events').EventEmitter;
var AccountDB = require("../database").account;
var Op = require("../database").Op;
var bcrypt = require('bcryptjs');
const saltSecurity = 15;
class Account extends EventEmitter {
	constructor(parent) {
		super();
		this.parent = parent;
		this.player = this.parent.player;
		this.data = false;
		this.loggedIn = false;
	}
	get id() {
		return this.data.uid ? this.data.uid : -1;
	}
	get status() {
		return this.loggedIn ? this.loggedIn : false;
	}
	async login(username, password) {
		return new Promise((resolve, reject) => {
			AccountDB.findOne({
				where: {
					username: username
				}
			}).then(pAccount => {
				//console.log("Account exists and found",pAccount);
				if (pAccount == null) {
					console.log("account not exists", pAccount);
					return reject("account not exists");
				} else {
					console.log("account exists", pAccount.dataValues);
					bcrypt.compare(password, pAccount.dataValues.password).then((res) => {
						if (res == true) {
							this.data = pAccount.dataValues;
							this.loggedIn = true;
							this.player.setVariable("loggedIn", true);
							return resolve(pAccount.dataValues);
						} else {
							return reject("password wrong");

						}
					});
				}
			}).catch(err => {
				console.log("[ERR]Error", err);
			})
		})
	}
	async register(username, password, email) {
		console.log("register route",username,password,email);
		return new Promise(async (resolve, reject) => {
			AccountDB.findOne({
				where: {
					[Op.or]: [{
						username: username
					}, {
						email: email
					}]
				}
			}).then(async (pAccount) => {
				if (pAccount == null) {
					console.log("this.player.serial", this.player.serial);
					if (!this.player) return reject("player not valid");
					if (!this.player.serial) return reject("serial not valid");
					//if (!this.player.rgscId) return reject("rgscId not valid");
					let pass_hash = await bcrypt.hash(password, 12);
					console.log("account not exists", pAccount, "passhash", pass_hash);
					AccountDB.create({
						username: username,
						password: pass_hash,
						email: email,
						hwid: this.player.serial,
						rgscId: "no" //this.player.rgscId
					}).then((e) => {
						console.log("Account created", e.dataValues);
						this.data = e.dataValues;
						this.loggedIn = true;
						return resolve(e.dataValues);
					}).catch((err) => {
						console.log("Error Creating account", err);
						return reject(err);
					})
				} else {
					console.log("account exists", pAccount.dataValues);
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