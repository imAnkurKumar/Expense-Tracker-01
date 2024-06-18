const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ResetPassword = sequelize.define("ResetPassword", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  active: Sequelize.BOOLEAN,
});

module.exports = ResetPassword;
