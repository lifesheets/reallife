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
			type: Sequelize.STRING,
			defaultValue: JSON.stringify({})
		},
		bank: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		cash: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		groupid: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		group_rank: {
			type: Sequelize.INTEGER,
			defaultValue: 0
		}
	});
};

