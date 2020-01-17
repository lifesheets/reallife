const {Sequelize,Model,DataTypes} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('house', {
		hid:{
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
		px:{
			type: Sequelize.FLOAT,
			defaultValue: 0.00
		},
		py:{
			type: Sequelize.FLOAT,
			defaultValue: 0.00
		},
		pz:{
			type: Sequelize.FLOAT,
			defaultValue: 0.00
		},
		dim:{
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

