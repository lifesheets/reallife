/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('unique_item', {
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    owner_type: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pos_cell: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pos_row: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'unique_item'
  });
};
