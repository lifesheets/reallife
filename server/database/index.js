const {Sequelize,Model,DataTypes} = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});


var user = require("./player.js")(sequelize);
var vehicle = require("./vehicle.js")(sequelize);



sequelize.authenticate().then(() => {
	sequelize.sync().then(() => {
		console.log('Connection has been established successfully.');
	}).catch(err => {
		console.error('Failed syncing Database',err);
	});
}).catch(err => {
	console.error('Unable to connect to the database:', err);
});

module.exports = {
	user: user,
	vehicle: vehicle
}