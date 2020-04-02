/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hardwareID: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    rSocialClubID: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    adminlvl: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    cash: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    spawn_x: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: '0'
    },
    spawn_y: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: '0'
    },
    spawn_z: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: '5'
    },
    rot_z: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    spawn_dim: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    group_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    group_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    life: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '100'
    },
    hunger: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '75'
    },
    playtime: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user'
  });
};
