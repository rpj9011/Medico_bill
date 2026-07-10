'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SalesInvoice = sequelize.define('SalesInvoice', {
  id:                      { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  voucher_no:              { type: DataTypes.STRING(30), allowNull: false, unique: true },
  invoice_no:              { type: DataTypes.STRING(30), allowNull: false },
  invoice_date:            { type: DataTypes.DATEONLY, allowNull: false },
  voucher_type:            {
    type: DataTypes.ENUM('credit', 'cash', 'counter'),
    allowNull: false,
    defaultValue: 'credit',
  },
  customer_id:             { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  salesman_id:             { type: DataTypes.INTEGER.UNSIGNED },
  godown_id:               { type: DataTypes.INTEGER.UNSIGNED },
  gross_amount:            { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  discount_amount:         { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  scheme_discount_amount:  { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  cash_discount_amount:    { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  sgst_amount:             { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  cgst_amount:             { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  igst_amount:             { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  cess_amount:             { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  freight:                 { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  round_off:               { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  net_amount:              { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  amount_received:         { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  amount_balance:          { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  is_delivered:            { type: DataTypes.BOOLEAN, defaultValue: false },
  irn:                     { type: DataTypes.STRING(100) },  // e-invoice IRN
  eway_bill_no:            { type: DataTypes.STRING(20) },
  narration:               { type: DataTypes.TEXT },
  is_cancelled:            { type: DataTypes.BOOLEAN, defaultValue: false },
  challan_id:              { type: DataTypes.INTEGER.UNSIGNED },
}, {
  tableName: 'sales_invoices',
  indexes: [
    { fields: ['invoice_no'] },
    { fields: ['customer_id'] },
    { fields: ['invoice_date'] },
    { fields: ['voucher_type'] },
  ],
});

module.exports = SalesInvoice;
