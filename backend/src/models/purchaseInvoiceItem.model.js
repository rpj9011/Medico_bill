'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PurchaseInvoiceItem = sequelize.define('PurchaseInvoiceItem', {
  id:                  { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  purchase_invoice_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  product_id:          { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  batch_no:            { type: DataTypes.STRING(50), allowNull: false },
  expiry_date:         { type: DataTypes.DATEONLY },
  quantity:            { type: DataTypes.DECIMAL(10, 3), allowNull: false },
  free_quantity:       { type: DataTypes.DECIMAL(10, 3), defaultValue: 0 },
  mrp:                 { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  purchase_rate:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  ptr:                 { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  discount_pct:        { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  discount_amount:     { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  taxable_amount:      { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  sgst_pct:            { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  sgst_amount:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  cgst_pct:            { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  cgst_amount:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  igst_pct:            { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  igst_amount:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  cess_pct:            { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  cess_amount:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  line_total:          { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  hsn_code:            { type: DataTypes.STRING(10) },
}, { tableName: 'purchase_invoice_items' });

module.exports = PurchaseInvoiceItem;
