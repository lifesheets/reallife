const {Sequelize,Model,DataTypes} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('property', {
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		x:{
			type: Sequelize.FLOAT,
			defaultValue: 0.00
		},
		y:{
			type: Sequelize.FLOAT,
			defaultValue: 0.00
		},
		z:{
			type: Sequelize.FLOAT,
			defaultValue: 0.00
		},
		dimension:{
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		interior:{
			type: Sequelize.INTEGER,
			defaultValue: 0
		},
		data:{
			type: Sequelize.TEXT,
			defaultValue: JSON.stringify({})
		}
	});
};

