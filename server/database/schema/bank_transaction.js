/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bank_transaction', {
    transactionid: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bank_account: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    bank_account_typ: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    volumen: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    changed_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'bank_transaction'
  });
};
