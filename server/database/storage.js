const {
	Sequelize,
	Model,
	DataTypes
} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('storage', {
		owner_id: {
			type: Sequelize.STRING
		},
		itemid: {
			type: Sequelize.INTEGER
		},
		count: {
			type: Sequelize.INTEGER,
			defaultValue: 0.00
		},
		data: {
			type: Sequelize.TEXT,
			defaultValue: JSON.stringify({})
		}
	}, {
		hooks: {
			afterUpdate() {
				// Do other stuff
				console.log("item updated");
			}
		}
	});
};