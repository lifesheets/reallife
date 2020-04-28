/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sanction', {
    user_id: { // user id
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    sanc_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    length: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    start: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    removed_at: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    removed_from: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'sanction'
  });
};
