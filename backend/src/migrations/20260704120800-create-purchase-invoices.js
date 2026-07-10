'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_invoices', {
      id:              { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      voucher_no:      { type: Sequelize.STRING(30), allowNull: false, unique: true },
      bill_no:         { type: Sequelize.STRING(50), allowNull: false },
      bill_date:       { type: Sequelize.DATEONLY, allowNull: false },
      supplier_id:     { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'parties', key: 'id' }, onDelete: 'RESTRICT' },
      godown_id:       { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'godowns', key: 'id' }, onDelete: 'RESTRICT' },
      gross_amount:    { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      discount_amount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      sgst_amount:     { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      cgst_amount:     { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      igst_amount:     { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      cess_amount:     { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      freight:         { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      other_charges:   { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      round_off:       { type: Sequelize.DECIMAL(6, 2), defaultValue: 0 },
      net_amount:      { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      amount_paid:     { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      amount_balance:  { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      lr_no:           Sequelize.STRING(50),
      transport:       Sequelize.STRING(100),
      eway_bill_no:    Sequelize.STRING(20),
      narration:       Sequelize.TEXT,
      is_cancelled:    { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at:      { type: Sequelize.DATE, allowNull: false },
      updated_at:      { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('purchase_invoices', ['bill_no']);
    await queryInterface.addIndex('purchase_invoices', ['supplier_id']);
    await queryInterface.addIndex('purchase_invoices', ['bill_date']);

    await queryInterface.createTable('purchase_invoice_items', {
      id:                  { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      purchase_invoice_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'purchase_invoices', key: 'id' }, onDelete: 'CASCADE' },
      product_id:          { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'RESTRICT' },
      batch_no:            { type: Sequelize.STRING(50), allowNull: false },
      expiry_date:         Sequelize.DATEONLY,
      quantity:            { type: Sequelize.DECIMAL(10, 3), allowNull: false },
      free_quantity:       { type: Sequelize.DECIMAL(10, 3), defaultValue: 0 },
      mrp:                 { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      purchase_rate:       { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      ptr:                 { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      discount_pct:        { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      discount_amount:     { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      taxable_amount:      { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      sgst_pct:            { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      sgst_amount:         { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      cgst_pct:            { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      cgst_amount:         { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      igst_pct:            { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      igst_amount:         { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      cess_pct:            { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      cess_amount:         { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      line_total:          { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      hsn_code:            Sequelize.STRING(10),
      created_at:          { type: Sequelize.DATE, allowNull: false },
      updated_at:          { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('purchase_invoice_items');
    await queryInterface.dropTable('purchase_invoices');
  },
};
