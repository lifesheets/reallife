//var MySQL = require("../libs/mysql.js");
var EventEmitter = require('events').EventEmitter;
var AccountDB = require("../database").account;
var Op = require("../database").Op;
var e = require("../libs/enums.js");
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
		this._dbentry;
		this._data = [];
	}
	async init() {
		return new Promise((resolve, reject) => {
			AccountDB.findOne({
				where: {
					uid: this.parent.id
				}
			}).then(async (pAccount) => {
				//console.log("account",pAccount.char)
				this._dbentry = pAccount;
				this._data = JSON.parse(pAccount.char);
			});
		})
	}
	reload() {
		console.log("Realod Appearance");
		this.parent.log("Reloaded Appearance")
	}
	saveData(data) {
		console.log("char data", typeof data);
		this._data = JSON.parse(data);
		this._dbentry.update({
			char: JSON.stringify(this._data)
		}).then(() => {
			console.log("saved char");
		}).catch(err => {
			console.log("err",err);
		})
	}
	async load() {
		let self = this;
		await self.init();
		let data = self._data;
		if (data.gender == "Male") {
			self.parent.player.model = mp.joaat('mp_m_freemode_01');
		} else {
			self.parent.player.model = mp.joaat('mp_f_freemode_01');
		}
		/*appearanceIndex*/
		if (data.makeup) {
			let index = appearanceIndex["makeup"];
			let overlayID = (data.makeup == 0) ? 255 : data.makeup - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.makeup_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (data.ageing) {
			let index = appearanceIndex["ageing"];
			let overlayID = (data.ageing == 0) ? 255 : data.ageing - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.ageing_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (data.blemishes) {
			let index = appearanceIndex["blemishes"];
			let overlayID = (data.blemishes == 0) ? 255 : data.blemishes - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.blemishes_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (data.facial_hair) {
			let index = appearanceIndex["facial_hair"];
			let overlayID = (data.facial_hair == 0) ? 255 : data.facial_hair - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.facial_hair_opacity) * 0.01, data.facial_hair_color /*ColorOverlay*/ , 0]);
		}
		if (data.eyebrows) {
			let index = appearanceIndex["eyebrows"];
			let overlayID = (data.eyebrows == 0) ? 255 : data.eyebrows - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.eyebrows_opacity) * 0.01, data.eyebrows_color /*ColorOverlay*/ , 0]);
		}
		if (data.blush) {
			let index = appearanceIndex["blush"];
			let overlayID = (data.blush == 0) ? 255 : data.blush - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.blush_opacity) * 0.01, data.blush_color /*ColorOverlay*/ , 0]);
		}
		if (data.complexion) {
			let index = appearanceIndex["complexion"];
			let overlayID = (data.complexion == 0) ? 255 : data.complexion - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.complexion_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (data.lipstick) {
			let index = appearanceIndex["lipstick"];
			let overlayID = (data.lipstick == 0) ? 255 : data.lipstick - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.lipstick_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (data.freckles) {
			let index = appearanceIndex["freckles"];
			let overlayID = (data.freckles == 0) ? 255 : data.freckles - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.freckles_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (data.chesthair) {
			let index = appearanceIndex["chesthair"];
			let overlayID = (data.chesthair == 0) ? 255 : data.chesthair - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.chesthair_opacity) * 0.01, data.chesthair_color /*ColorOverlay*/ , 0]);
		}
		if (data.sundamage) {
			let index = appearanceIndex["sundamage"];
			let overlayID = (data.sundamage == 0) ? 255 : data.sundamage - 1;
			self.parent.player.setHeadOverlay(index, [overlayID, /*Opacity*/ parseInt(data.sundamage_opacity) * 0.01, 0 /*ColorOverlay*/ , 0]);
		}
		if (data.facial) {
			data.facial.forEach(function(feature, i) {
				self.parent.player.setFaceFeature(parseInt(feature.index), parseFloat(feature.val) * 0.01);
			})
		}
		if (data.hair != undefined) {
			self.parent.player.setClothes(2, data.hair, 0, 2);
			self.parent.player.setHairColor(data.hair_color, data.hair_highlight_color);
			// self.parent.player.setEyeColor(data.eyeColor);
			self.parent.player.eyeColor = parseInt(data.eyeColor);
			/*self.parent.player.setHeadOverlayColor(1, 1, data.facial_hair_color, 0);
			self.parent.player.setHeadOverlayColor(2, 1, data.eyebrows_color, 0);
			self.parent.player.setHeadOverlayColor(5, 2, data.blush_color, 0);
			self.parent.player.setHeadOverlayColor(8, 2, data.lipstick, 0);
			self.parent.player.setHeadOverlayColor(10, 1, data.chesthair_color, 0);*/
		}
		if ((data.fatherIndex != undefined) && (data.motherIndex != undefined) && (data.tone != undefined) && (data.resemblance != undefined)) {
			self.parent.player.setHeadBlend(
				// shape
				values["mother"][data.motherIndex], values["father"][data.fatherIndex], 0,
				// skin
				values["mother"][data.motherIndex], values["father"][data.fatherIndex], 0,
				// mixes
				data.resemblance * 0.01, data.tone * 0.01, 0.0);
		}
	}
}
module.exports = Appearance;