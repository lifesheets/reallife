//var MySQL = require("../libs/mysql.js");
var EventEmitter = require('events').EventEmitter;
var UserDB = require("../database").user;
var Op = require("../database").Op;
var e = require("../libs/enums.js");
var LogManager = require("./logs.js");
/*********************************************
 **********************************************
 **********************************************/
var values = [];
values["father"] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
values["mother"] = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];
const appearanceIndex = {
	"blemishes": 0,
	"facial_hair": 1,
	"eyebrows": 2,
	"ageing": 3,
	"makeup": 4,
	"blush": 5,
	"complexion": 6,
	"sundamage": 7,
	"lipstick": 8,
	"freckles": 9,
	"chesthair": 10
}
class Appearance extends EventEmitter {
	constructor(parent) {
		super();
		this.parent = parent;
		this.player = parent.player;
		this.account = parent.account;
		this.logger = new LogManager("Appearance",this.player.name);
		this.char = [];
	}
	async init() {
		return new Promise((resolve, reject) => {

			this.logger.log("checking Char over Account Instance");
			if (this.account.this.char.char.length > 0) {
				try {
					this.char = JSON.parse(this.account.this.char.char)
					return resolve();
				} catch(err) {
					return reject(err);
				}

			}
			/*UserDB.findOne({
				where: {
					uid: this.parent.id
				}
			}).then(async (pAccount) => {
				console.log("account char",pAccount.char)
				this.db = pAccount;
				this._data = JSON.parse(pAccount.char);

				return resolve();
			}).catch(err => {
				console.log(err);
				return reject(err);
			})*/
		})
	}
	reload() {
		console.log("Realod Appearance");
		this.parent.log("Reloaded Appearance")
	}
	async saveData(data) {
		await this.init();
		console.log("char data", typeof data);
		this.char = JSON.parse(data);
		this.account.char.update({
			char: JSON.stringify(this.char)
		}).then(() => {
			console.log("saved char");
		}).catch(err => {
			console.log("err", err);
		})
	}
	async load() {
		await this.init();
		console.log("load char");
		if (this.char.gender == "Male") {
			this.parent.player.model = mp.joaat('mp_m_freemode_01');
		} else {
			this.parent.player.model = mp.joaat('mp_f_freemode_01');
		}
		/*appearanceIndex*/
		if (this.char.makeup) {
			let index = appearanceIndex["makeup"];
			let overlayID = (this.char.makeup == 0) ? 255 : this.char.makeup - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.makeup_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (this.char.ageing) {
			let index = appearanceIndex["ageing"];
			let overlayID = (this.char.ageing == 0) ? 255 : this.char.ageing - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.ageing_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (this.char.blemishes) {
			let index = appearanceIndex["blemishes"];
			let overlayID = (this.char.blemishes == 0) ? 255 : this.char.blemishes - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.blemishes_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (this.char.facial_hair) {
			let index = appearanceIndex["facial_hair"];
			let overlayID = (this.char.facial_hair == 0) ? 255 : this.char.facial_hair - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.facial_hair_opacity) * 0.01, this.char.facial_hair_color /*ColorOverlay*/ , 0]);
		}
		if (this.char.eyebrows) {
			let index = appearanceIndex["eyebrows"];
			let overlayID = (this.char.eyebrows == 0) ? 255 : this.char.eyebrows - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.eyebrows_opacity) * 0.01, this.char.eyebrows_color /*ColorOverlay*/ , 0]);
		}
		if (this.char.blush) {
			let index = appearanceIndex["blush"];
			let overlayID = (this.char.blush == 0) ? 255 : this.char.blush - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.blush_opacity) * 0.01, this.char.blush_color /*ColorOverlay*/ , 0]);
		}
		if (this.char.complexion) {
			let index = appearanceIndex["complexion"];
			let overlayID = (this.char.complexion == 0) ? 255 : this.char.complexion - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.complexion_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (this.char.lipstick) {
			let index = appearanceIndex["lipstick"];
			let overlayID = (this.char.lipstick == 0) ? 255 : this.char.lipstick - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.lipstick_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (this.char.freckles) {
			let index = appearanceIndex["freckles"];
			let overlayID = (this.char.freckles == 0) ? 255 : this.char.freckles - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.freckles_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (this.char.chesthair) {
			let index = appearanceIndex["chesthair"];
			let overlayID = (this.char.chesthair == 0) ? 255 : this.char.chesthair - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.chesthair_opacity) * 0.01, this.char.chesthair_color /*ColorOverlay*/ , 0]);
		}
		if (this.char.sundamage) {
			let index = appearanceIndex["sundamage"];
			let overlayID = (this.char.sundamage == 0) ? 255 : this.char.sundamage - 1;
			this.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(this.char.sundamage_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (this.char.facial) {
			this.char.facial.forEach((feature, i) => {
				this.parent.player.setFaceFeature(parseInt(feature.index), parseFloat(feature.val) * 0.01);
			})
		}
		if (this.char.hair != undefined) {
			this.parent.player.setClothes(2, this.char.hair, 0, 2);
			this.parent.player.setHairColor(this.char.hair_color, this.char.hair_highlight_color);
			// self.parent.player.setEyeColor(this.char.eyeColor);
			this.parent.player.eyeColor = parseInt(this.char.eyeColor);
			/*self.parent.player.setHeadOverlayColor(1, 1, this.char.facial_hair_color, 0);
			self.parent.player.setHeadOverlayColor(2, 1, this.char.eyebrows_color, 0);
			self.parent.player.setHeadOverlayColor(5, 2, this.char.blush_color, 0);
			self.parent.player.setHeadOverlayColor(8, 2, this.char.lipstick, 0);
			self.parent.player.setHeadOverlayColor(10, 1, this.char.chesthair_color, 0);*/
		}
		if ((this.char.fatherIndex != undefined) && (this.char.motherIndex != undefined) && (this.char.tone != undefined) && (this.char.resemblance != undefined)) {
			this.parent.player.setHeadBlend(
				// shape
				values["mother"][this.char.motherIndex], values["father"][this.char.fatherIndex], 0,
				// skin
				values["mother"][this.char.motherIndex], values["father"][this.char.fatherIndex], 0,
				// mixes
				this.char.resemblance * 0.01, this.char.tone * 0.01, 0.0);
		}
	}
}
module.exports = Appearance;