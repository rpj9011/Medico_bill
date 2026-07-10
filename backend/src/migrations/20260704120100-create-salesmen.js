'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salesmen', {
      id:             { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      salesman_code:  { type: Sequelize.STRING(20), allowNull: false, unique: true },
      salesman_name:  { type: Sequelize.STRING(100), allowNull: false },
      commission_pct: { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      phone:          { type: Sequelize.STRING(20) },
      is_active:      { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at:     { type: Sequelize.DATE, allowNull: false },
      updated_at:     { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('salesmen'); },
};
