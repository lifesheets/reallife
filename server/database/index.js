const {Sequelize,Model,DataTypes} = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize('reallife', 'root', '', {
	host: '127.0.0.1',
	dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
},{
	timestamps: false
});


var account = require("./account.js")(sequelize);
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
	Op: Op,
	account: account,
	vehicle: vehicle
}