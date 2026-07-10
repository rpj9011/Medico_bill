'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CreditDebitNote = sequelize.define('CreditDebitNote', {
  id:                 { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  voucher_no:         { type: DataTypes.STRING(30), allowNull: false, unique: true },
  party_id:           { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  note_type:          { type: DataTypes.ENUM('credit', 'debit'), allowNull: false },
  note_date:          { type: DataTypes.DATEONLY, allowNull: false },
  related_invoice_id: { type: DataTypes.INTEGER.UNSIGNED },
  amount:             { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  sgst_amount:        { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  cgst_amount:        { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  igst_amount:        { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  reason:             { type: DataTypes.TEXT },
  is_cancelled:       { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'credit_debit_notes' });

module.exports = CreditDebitNote;
