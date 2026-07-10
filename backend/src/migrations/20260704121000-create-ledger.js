'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ledger_entries', {
      id:               { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      party_id:         { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'parties', key: 'id' }, onDelete: 'RESTRICT' },
      transaction_date: { type: Sequelize.DATEONLY, allowNull: false },
      voucher_type:     { type: Sequelize.STRING(50), allowNull: false },
      voucher_no:       { type: Sequelize.STRING(30), allowNull: false },
      debit_amount:     { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      credit_amount:    { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      narration:        Sequelize.TEXT,
      reference_type:   Sequelize.STRING(50),
      reference_id:     Sequelize.INTEGER.UNSIGNED,
      created_at:       { type: Sequelize.DATE, allowNull: false },
      updated_at:       { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('ledger_entries', ['party_id', 'transaction_date']);
    await queryInterface.addIndex('ledger_entries', ['voucher_no']);

    await queryInterface.createTable('credit_debit_notes', {
      id:                 { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      voucher_no:         { type: Sequelize.STRING(30), allowNull: false, unique: true },
      party_id:           { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'parties', key: 'id' }, onDelete: 'RESTRICT' },
      note_type:          { type: Sequelize.ENUM('credit', 'debit'), allowNull: false },
      note_date:          { type: Sequelize.DATEONLY, allowNull: false },
      related_invoice_id: Sequelize.INTEGER.UNSIGNED,
      amount:             { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      sgst_amount:        { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      cgst_amount:        { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      igst_amount:        { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      reason:             Sequelize.TEXT,
      is_cancelled:       { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at:         { type: Sequelize.DATE, allowNull: false },
      updated_at:         { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('receipt_payments', {
      id:           { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      voucher_no:   { type: Sequelize.STRING(30), allowNull: false, unique: true },
      party_id:     { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'parties', key: 'id' }, onDelete: 'RESTRICT' },
      type:         { type: Sequelize.ENUM('receipt', 'payment'), allowNull: false },
      txn_date:     { type: Sequelize.DATEONLY, allowNull: false },
      mode:         { type: Sequelize.ENUM('cash', 'cheque', 'bank', 'upi', 'neft', 'rtgs'), allowNull: false },
      amount:       { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      cheque_no:    Sequelize.STRING(20),
      cheque_date:  Sequelize.DATEONLY,
      bank_name:    Sequelize.STRING(100),
      bank_account: Sequelize.STRING(30),
      utr_no:       Sequelize.STRING(30),
      is_cleared:   { type: Sequelize.BOOLEAN, defaultValue: false },
      cleared_date: Sequelize.DATEONLY,
      narration:    Sequelize.TEXT,
      is_cancelled: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at:   { type: Sequelize.DATE, allowNull: false },
      updated_at:   { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('receipt_payments');
    await queryInterface.dropTable('credit_debit_notes');
    await queryInterface.dropTable('ledger_entries');
  },
};
