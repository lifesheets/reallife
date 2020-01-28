const {Sequelize,Model,DataTypes} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('groups', {
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name:{
			type: Sequelize.STRING,
			defaultValue:"no-name"
		},
		data:{
			type: Sequelize.TEXT,
			defaultValue: JSON.stringify({})
		}
	});
};

