/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vehicle', {
    vid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    model_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pos_x: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pos_y: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pos_z: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    rot_x: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    rot_y: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    rot_z: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pos_dim: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tuning: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'vehicle'
  });
};
