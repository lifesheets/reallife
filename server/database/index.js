const {
	Sequelize,
	Model,
	DataTypes
} = require('sequelize');
var mysql = require('mysql');

var e = require("../libs/utils.js").events;

const sequelize = new Sequelize("reallife", 'ragemp', 'panzerKnacker', {
	host: '127.0.0.1',   //or 127.0.0.1
  	dialect: 'mysql',
  	logging: function () {},
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
}, {
	timestamps: false
});

var userDB = require("./schema/user.js")(sequelize,DataTypes);
var uniqueItemDB = require("./schema/unique_item.js")(sequelize,DataTypes);
var commingItemDB = require("./schema/common_item.js")(sequelize,DataTypes);
var vehicleDB = require("./schema/vehicle.js")(sequelize,DataTypes);
var sanctionDB = require("./schema/sanction.js")(sequelize,DataTypes);
var licenseDB = require("./schema/license.js")(sequelize,DataTypes);
var bank_account_permissionDB = require("./schema/bank_account_permissions.js")(sequelize,DataTypes);
var bank_accountDB = require("./schema/bank_account.js")(sequelize,DataTypes);
var bank_transactionDB = require("./schema/bank_transaction.js")(sequelize,DataTypes);
sequelize.authenticate().then(() => {
	sequelize.sync().then(() => {
		e.emit("DatabaseConnected")
		console.log('Connection has been established successfully.');
	}).catch(err => {
		console.error('Failed syncing Database', err);
	});
}).catch(err => {
	console.error('Unable to connect to the database:', err);
});
module.exports = {
	Sequelize: Sequelize,
	user: userDB,
	uniqueItem: uniqueItemDB,
	commingItem: commingItemDB,
	vehicle: vehicleDB,
	sanction: sanctionDB,
	license: licenseDB,
	bank_account_permissions: bank_account_permissionDB,
	bank_account: bank_accountDB,
	bank_transaction: bank_transactionDB,
}
