'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quotation = sequelize.define('Quotation', {
  id:              { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  voucher_no:      { type: DataTypes.STRING(30), allowNull: false, unique: true },
  quotation_date:  { type: DataTypes.DATEONLY, allowNull: false },
  customer_id:     { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  salesman_id:     { type: DataTypes.INTEGER.UNSIGNED },
  valid_till:      { type: DataTypes.DATEONLY },
  gross_amount:    { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  discount_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  gst_amount:      { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  net_amount:      { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  status:          { type: DataTypes.ENUM('draft', 'sent', 'converted', 'cancelled'), defaultValue: 'draft' },
  converted_to_id: { type: DataTypes.INTEGER.UNSIGNED },
  narration:       { type: DataTypes.TEXT },
}, { tableName: 'quotations' });

module.exports = Quotation;
