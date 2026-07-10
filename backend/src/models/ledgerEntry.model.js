'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LedgerEntry = sequelize.define('LedgerEntry', {
  id:               { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  party_id:         { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  transaction_date: { type: DataTypes.DATEONLY, allowNull: false },
  voucher_type:     { type: DataTypes.STRING(50), allowNull: false },
  voucher_no:       { type: DataTypes.STRING(30), allowNull: false },
  debit_amount:     { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  credit_amount:    { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  narration:        { type: DataTypes.TEXT },
  reference_type:   { type: DataTypes.STRING(50) },
  reference_id:     { type: DataTypes.INTEGER.UNSIGNED },
}, {
  tableName: 'ledger_entries',
  indexes: [
    { fields: ['party_id', 'transaction_date'] },
    { fields: ['voucher_no'] },
  ],
});

module.exports = LedgerEntry;
