/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('license', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    User_uid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'license'
  });
};
