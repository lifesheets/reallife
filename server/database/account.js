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
			allowNull: false,
		    validate: {
		    	isEmail: true
		    }
		},
		hwid:{
			type: Sequelize.STRING,
			allowNull: false
		},
		rgscId:{
			type: Sequelize.STRING,
			allowNull: false
		}
	});
};

