'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schemes', {
      id:              { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      product_id:      { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'RESTRICT' },
      scheme_qty:      { type: Sequelize.DECIMAL(10, 3), allowNull: false },
      scheme_free_qty: { type: Sequelize.DECIMAL(10, 3), defaultValue: 0 },
      discount_pct:    { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      valid_from:      Sequelize.DATEONLY,
      valid_to:        Sequelize.DATEONLY,
      is_active:       { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at:      { type: Sequelize.DATE, allowNull: false },
      updated_at:      { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('schemes'); },
};
