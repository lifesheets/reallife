const {Sequelize,Model,DataTypes} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('inventory', {
		owner_id:{
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		type:{
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		x:{
			type: Sequelize.INTEGER,
			defaultValue: 0.00
		},
		data:{
			type: Sequelize.TEXT,
			defaultValue: JSON.stringify({})
		}
	});
};

