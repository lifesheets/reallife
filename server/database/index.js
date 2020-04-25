const {
	Sequelize,
	Model,
	DataTypes
} = require('sequelize');
var mysql = require('mysql');

 
// pass TMmzs9oo9DL6Y9Fm;
const sequelize = new Sequelize("reallife", 'ragemp', 'RGj2sVmBtxLdJ90L', {
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

var user = require("./schema/user.js")(sequelize,DataTypes);
sequelize.authenticate().then(() => {
	sequelize.sync().then(() => {
		mp.events.delayInitialization = false;
		console.log('Connection has been established successfully.');
	}).catch(err => {
		console.error('Failed syncing Database', err);
	});
}).catch(err => {
	console.error('Unable to connect to the database:', err);
});
module.exports = {
	Sequelize: Sequelize,
	user: user
}