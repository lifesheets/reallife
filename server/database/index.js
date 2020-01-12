const {
	Sequelize,
	Model,
	DataTypes
} = require('sequelize');

// pass TMmzs9oo9DL6Y9Fm;
const Op = Sequelize.Op;
const database_name = "reallife";
const sequelize = new Sequelize(database_name, 'root', 'TMmzs9oo9DL6Y9Fm', {
	host: '127.0.0.1',
	dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
}, {
	timestamps: false
});
sequelize.query("CREATE DATABASE `" + database_name + "`;").then(data => {
	console.log("created");
});
var account = require("./account.js")(sequelize);
var vehicle = require("./vehicle.js")(sequelize);
sequelize.authenticate().then(() => {
	sequelize.sync().then(() => {
		console.log('Connection has been established successfully.');
	}).catch(err => {
		console.error('Failed syncing Database', err);
	});
}).catch(err => {
	console.error('Unable to connect to the database:', err);
});
module.exports = {
	Op: Op,
	account: account,
	vehicle: vehicle
}