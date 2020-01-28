const {Sequelize,Model,DataTypes} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('user', {
		uid:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		username:{
			type: Sequelize.STRING,
			unique: true
		},
		password:{
			type: Sequelize.STRING,
			allowNull: false
		},
		email:{
			type: Sequelize.STRING,
			allowNull: false
		},
		hwid:{
			type: Sequelize.STRING,
			allowNull: false
		},
		rgscId:{
			type: Sequelize.STRING,
			allowNull: false
		},
		adminlvl:{
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		char: {
			type: Sequelize.TEXT,
			defaultValue: JSON.stringify({})
		},
		cash: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		spawn_x:{
			type:Sequelize.FLOAT,
			defaultValue: 0
		},
		spawn_y:{
			type:Sequelize.FLOAT,
			defaultValue: 0
		},
		spawn_z:{
			type:Sequelize.FLOAT,
			defaultValue: 0
		},
		licenses:{
			type:Sequelize.TEXT,
			default: JSON.stringify({})
		}
	});
};

