const {	Sequelize,	Model,	DataTypes} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('vehicle', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		key_id:{
			type: Sequelize.INTEGER,
			allowNull: false
		},
		model: Sequelize.STRING,
		x: Sequelize.FLOAT,
		y: Sequelize.FLOAT,
		z: Sequelize.FLOAT,
		rx: Sequelize.FLOAT,
		ry: Sequelize.FLOAT,
		rz: Sequelize.FLOAT,
		data: {
			type: Sequelize.TEXT,
			defaultValue: JSON.stringify({})
		}
	});
};