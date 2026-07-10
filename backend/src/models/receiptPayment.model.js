'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReceiptPayment = sequelize.define('ReceiptPayment', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  voucher_no:   { type: DataTypes.STRING(30), allowNull: false, unique: true },
  party_id:     { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  type:         { type: DataTypes.ENUM('receipt', 'payment'), allowNull: false },
  txn_date:     { type: DataTypes.DATEONLY, allowNull: false },
  mode:         { type: DataTypes.ENUM('cash', 'cheque', 'bank', 'upi', 'neft', 'rtgs'), allowNull: false },
  amount:       { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  cheque_no:    { type: DataTypes.STRING(20) },
  cheque_date:  { type: DataTypes.DATEONLY },
  bank_name:    { type: DataTypes.STRING(100) },
  bank_account: { type: DataTypes.STRING(30) },
  utr_no:       { type: DataTypes.STRING(30) },
  is_cleared:   { type: DataTypes.BOOLEAN, defaultValue: false },
  cleared_date: { type: DataTypes.DATEONLY },
  narration:    { type: DataTypes.TEXT },
  is_cancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'receipt_payments' });

module.exports = ReceiptPayment;
