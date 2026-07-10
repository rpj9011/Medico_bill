'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Challan = sequelize.define('Challan', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  voucher_no:   { type: DataTypes.STRING(30), allowNull: false, unique: true },
  challan_date: { type: DataTypes.DATEONLY, allowNull: false },
  customer_id:  { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  salesman_id:  { type: DataTypes.INTEGER.UNSIGNED },
  godown_id:    { type: DataTypes.INTEGER.UNSIGNED },
  transport:    { type: DataTypes.STRING(100) },
  lr_no:        { type: DataTypes.STRING(50) },
  status:       { type: DataTypes.ENUM('open', 'partial', 'invoiced', 'cancelled'), defaultValue: 'open' },
  narration:    { type: DataTypes.TEXT },
}, { tableName: 'challans' });

module.exports = Challan;
