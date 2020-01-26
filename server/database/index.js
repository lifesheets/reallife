const {
	Sequelize,
	Model,
	DataTypes
} = require('sequelize');
var mysql = require('mysql');


// pass TMmzs9oo9DL6Y9Fm;
const Op = Sequelize.Op;
const sequelize = new Sequelize("reallife", 'root', '1234567890', {
	host: '127.0.0.1',   //or 127.0.0.1
  	dialect: 'mysql',
  	logging: function () {},
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        socketPath: "/var/run/mysqld/mysqld.sock"
    }
}, {
	timestamps: false
});

var house = require("./house.js")(sequelize);
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
	vehicle: vehicle,
	house: house
}