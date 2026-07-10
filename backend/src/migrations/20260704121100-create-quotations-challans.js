'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quotations', {
      id:              { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      voucher_no:      { type: Sequelize.STRING(30), allowNull: false, unique: true },
      quotation_date:  { type: Sequelize.DATEONLY, allowNull: false },
      customer_id:     { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'parties', key: 'id' }, onDelete: 'RESTRICT' },
      salesman_id:     { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'salesmen', key: 'id' }, onDelete: 'RESTRICT' },
      valid_till:      Sequelize.DATEONLY,
      gross_amount:    { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      discount_amount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      gst_amount:      { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      net_amount:      { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      status:          { type: Sequelize.ENUM('draft', 'sent', 'converted', 'cancelled'), defaultValue: 'draft' },
      converted_to_id: Sequelize.INTEGER.UNSIGNED,
      narration:       Sequelize.TEXT,
      created_at:      { type: Sequelize.DATE, allowNull: false },
      updated_at:      { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('quotation_items', {
      id:           { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      quotation_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'quotations', key: 'id' }, onDelete: 'CASCADE' },
      product_id:   { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'RESTRICT' },
      quantity:     { type: Sequelize.DECIMAL(10, 3), allowNull: false },
      mrp:          { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      rate:         { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      discount_pct: { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      gst_pct:      { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      line_total:   { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      created_at:   { type: Sequelize.DATE, allowNull: false },
      updated_at:   { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('challans', {
      id:           { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      voucher_no:   { type: Sequelize.STRING(30), allowNull: false, unique: true },
      challan_date: { type: Sequelize.DATEONLY, allowNull: false },
      customer_id:  { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'parties', key: 'id' }, onDelete: 'RESTRICT' },
      salesman_id:  { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'salesmen', key: 'id' }, onDelete: 'RESTRICT' },
      godown_id:    { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'godowns', key: 'id' }, onDelete: 'RESTRICT' },
      transport:    Sequelize.STRING(100),
      lr_no:        Sequelize.STRING(50),
      status:       { type: Sequelize.ENUM('open', 'partial', 'invoiced', 'cancelled'), defaultValue: 'open' },
      narration:    Sequelize.TEXT,
      created_at:   { type: Sequelize.DATE, allowNull: false },
      updated_at:   { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('challan_items', {
      id:         { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      challan_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'challans', key: 'id' }, onDelete: 'CASCADE' },
      product_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'RESTRICT' },
      batch_no:   Sequelize.STRING(50),
      quantity:   { type: Sequelize.DECIMAL(10, 3), allowNull: false },
      mrp:        { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      rate:       { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      line_total: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('challan_items');
    await queryInterface.dropTable('challans');
    await queryInterface.dropTable('quotation_items');
    await queryInterface.dropTable('quotations');
  },
};
