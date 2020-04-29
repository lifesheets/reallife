/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('license', {
    permid: { // permission ID
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_id: { // user id
       type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'license'
  });
};
