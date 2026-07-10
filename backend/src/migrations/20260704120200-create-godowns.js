'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('godowns', {
      id:          { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      godown_code: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      godown_name: { type: Sequelize.STRING(100), allowNull: false },
      address:     { type: Sequelize.TEXT },
      is_active:   { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at:  { type: Sequelize.DATE, allowNull: false },
      updated_at:  { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('godowns'); },
};
