'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PurchaseInvoice = sequelize.define('PurchaseInvoice', {
  id:                  { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  voucher_no:          { type: DataTypes.STRING(30), allowNull: false, unique: true },
  bill_no:             { type: DataTypes.STRING(50), allowNull: false },
  bill_date:           { type: DataTypes.DATEONLY, allowNull: false },
  supplier_id:         { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  godown_id:           { type: DataTypes.INTEGER.UNSIGNED },
  gross_amount:        { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  discount_amount:     { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  sgst_amount:         { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  cgst_amount:         { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  igst_amount:         { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  cess_amount:         { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  freight:             { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  other_charges:       { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  round_off:           { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  net_amount:          { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  amount_paid:         { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  amount_balance:      { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  lr_no:               { type: DataTypes.STRING(50) },
  transport:           { type: DataTypes.STRING(100) },
  eway_bill_no:        { type: DataTypes.STRING(20) },
  narration:           { type: DataTypes.TEXT },
  is_cancelled:        { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'purchase_invoices',
  indexes: [{ fields: ['bill_no'] }, { fields: ['supplier_id'] }, { fields: ['bill_date'] }],
});

module.exports = PurchaseInvoice;
