var EventEmitter = require('events').EventEmitter;
var UserDB = require("../database").user;
var Sequelize = require("../database").Sequelize;
var e = require("../libs/enums.js");
var bcrypt = require('bcryptjs');
const saltSecurity = 15;
class Account extends EventEmitter {
	constructor(parent) {
		super();
		this.parent = parent;
		this.player = this.parent.player;
		this.db = false;
		this.loggedIn = false;
		this.available = true;
	}
	get uid( ){
		if ((!this.db) || (!this.ready)) return "-";
		return this.db.uid;
	}
	get status() {
		return this.loggedIn ? this.loggedIn : false;
	}
	get data() {
		return this.db;
	}
	save() {
		return this.db.save();
	}
	async login(username, password) {
		if (!this.available) return;
		console.log("register route", username, password);
		this.available = false;
		return new Promise((resolve, reject) => {
			UserDB.findOne({
				where: {
					username: username
				}
			}).then(pAccount => {
				//console.log("Account exists and found",pAccount);
				this.available = true;
				if (pAccount == null) {
					console.log("account not exists", pAccount);
					return reject("account not exists");
				} else {
					console.log("account exists");
					bcrypt.compare(password, pAccount.password).then((res) => {
						if (res == true) {
							this.db = pAccount;
							this.loggedIn = true;
							this.player.setVariable("loggedIn", true);
							return resolve(pAccount);
						} else {
							return reject(e.PASSWORD_WRONG);
						}
					});
				}
			}).catch(err => {
				this.available = true;
				console.log("[ERR]Error", err);
			})
		})
	}
	async register(username, password, email) {
		if (!this.available) return;
		console.log("register route", username, password, email);
		this.available = false;
		return new Promise(async (resolve, reject) => {
			UserDB.findOne({
				where: {
					[Sequelize.Op.or]: [{
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
					UserDB.create({
						username: username,
						password: pass_hash,
						email: email,
						hardwareID: this.player.serial,
						rSocialClubID: this.player.rgscId
					}).then((e) => {
						console.log("Account created", e);
						this.db = e;
						this.loggedIn = true;
						this.available = true;
						return resolve(e);
					}).catch((err) => {
						console.log("Error Creating account", err);
						this.available = true;
						return reject(err);
					})
				} else {
					console.log("account exists", pAccount);
					this.available = true;
					return reject(e.EMAIL_USERNAME_IN_USE);
				}
			}).catch(err => {
				this.available = true;
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