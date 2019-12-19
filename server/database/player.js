const {Sequelize,Model,DataTypes} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('user', {
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		nickname:{
			type: Sequelize.STRING,
			unique: true
		},
		password:{
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				checkPassword(value) {
			        if (value === null || (value.length < 3)) {
			          	throw new Error("Passwort nicht lang genug.");
			        }
			    })
			}
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
		}
	});
};

