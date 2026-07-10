'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id:                 { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      product_code:       { type: Sequelize.STRING(30), allowNull: false, unique: true },
      product_name:       { type: Sequelize.STRING(200), allowNull: false },
      pack:               Sequelize.STRING(30),
      uom:                Sequelize.STRING(20),
      company_id:         { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'companies', key: 'id' }, onDelete: 'RESTRICT' },
      hsn_code:           Sequelize.STRING(10),
      sgst_pct:           { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      cgst_pct:           { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      igst_pct:           { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      cess_pct:           { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      mrp:                { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      purchase_rate:      { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      sale_rate:          { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      ptr:                { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      min_level:          { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      max_level:          { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      is_dpco_controlled: { type: Sequelize.BOOLEAN, defaultValue: false },
      dpco_price_ceiling: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      is_schedule_drug:   { type: Sequelize.BOOLEAN, defaultValue: false },
      barcode:            Sequelize.STRING(50),
      rack_location:      Sequelize.STRING(30),
      is_active:          { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at:         { type: Sequelize.DATE, allowNull: false },
      updated_at:         { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('products', ['product_code']);
    await queryInterface.addIndex('products', ['product_name']);
    await queryInterface.addIndex('products', ['barcode']);
  },
  async down(queryInterface) { await queryInterface.dropTable('products'); },
};
