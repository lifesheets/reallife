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
    tune1: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune2: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune3: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune4: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune5: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune6: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune7: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune8: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune9: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune10: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune11: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune12: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune13: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune14: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune15: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune16: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune18: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune20: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune22: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune23: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune24: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune25: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune27: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune28: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune30: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune33: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune34: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune35: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune38: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune40: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune48: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune55: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune62: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune66: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tune67: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    color1_r: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    color1_g: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    color1_b: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    color2_r: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    color2_g: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    color2_b: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'vehicle'
  });
};
