'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_invoices', {
      id:                     { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      voucher_no:             { type: Sequelize.STRING(30), allowNull: false, unique: true },
      invoice_no:             { type: Sequelize.STRING(30), allowNull: false },
      invoice_date:           { type: Sequelize.DATEONLY, allowNull: false },
      voucher_type:           { type: Sequelize.ENUM('credit', 'cash', 'counter'), allowNull: false, defaultValue: 'credit' },
      customer_id:            { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'parties', key: 'id' }, onDelete: 'RESTRICT' },
      salesman_id:            { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'salesmen', key: 'id' }, onDelete: 'RESTRICT' },
      godown_id:              { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'godowns', key: 'id' }, onDelete: 'RESTRICT' },
      gross_amount:           { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      discount_amount:        { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      scheme_discount_amount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      cash_discount_amount:   { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      sgst_amount:            { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      cgst_amount:            { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      igst_amount:            { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      cess_amount:            { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      freight:                { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      round_off:              { type: Sequelize.DECIMAL(6, 2), defaultValue: 0 },
      net_amount:             { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      amount_received:        { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      amount_balance:         { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      is_delivered:           { type: Sequelize.BOOLEAN, defaultValue: false },
      irn:                    Sequelize.STRING(100),
      eway_bill_no:           Sequelize.STRING(20),
      challan_id:             Sequelize.INTEGER.UNSIGNED,
      narration:              Sequelize.TEXT,
      is_cancelled:           { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at:             { type: Sequelize.DATE, allowNull: false },
      updated_at:             { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('sales_invoices', ['invoice_no']);
    await queryInterface.addIndex('sales_invoices', ['customer_id']);
    await queryInterface.addIndex('sales_invoices', ['invoice_date']);
    await queryInterface.addIndex('sales_invoices', ['voucher_type']);

    await queryInterface.createTable('sales_invoice_items', {
      id:               { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      sales_invoice_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'sales_invoices', key: 'id' }, onDelete: 'CASCADE' },
      product_id:       { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'RESTRICT' },
      batch_no:         { type: Sequelize.STRING(50), allowNull: false },
      expiry_date:      Sequelize.DATEONLY,
      quantity:         { type: Sequelize.DECIMAL(10, 3), allowNull: false },
      free_quantity:    { type: Sequelize.DECIMAL(10, 3), defaultValue: 0 },
      mrp:              { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      rate:             { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      ptr:              { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      discount_pct:     { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      discount_amount:  { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      taxable_amount:   { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      sgst_pct:         { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      sgst_amount:      { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      cgst_pct:         { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      cgst_amount:      { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      igst_pct:         { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      igst_amount:      { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      cess_pct:         { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      cess_amount:      { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      line_total:       { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      hsn_code:         Sequelize.STRING(10),
      is_scheme_item:   { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at:       { type: Sequelize.DATE, allowNull: false },
      updated_at:       { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('sales_invoice_items');
    await queryInterface.dropTable('sales_invoices');
  },
};
