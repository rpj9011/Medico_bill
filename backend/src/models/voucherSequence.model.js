'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VoucherSequence = sequelize.define('VoucherSequence', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  voucher_type: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  prefix:       { type: DataTypes.STRING(10), defaultValue: '' },
  suffix:       { type: DataTypes.STRING(10), defaultValue: '' },
  current_no:   { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0 },
  financial_year: { type: DataTypes.STRING(10) },   // e.g. "2526"
  reset_yearly: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'voucher_sequences' });

module.exports = VoucherSequence;
