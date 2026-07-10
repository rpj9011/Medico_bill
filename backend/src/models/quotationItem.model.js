'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuotationItem = sequelize.define('QuotationItem', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  quotation_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  product_id:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  quantity:     { type: DataTypes.DECIMAL(10, 3), allowNull: false },
  mrp:          { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  rate:         { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount_pct: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  gst_pct:      { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  line_total:   { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
}, { tableName: 'quotation_items' });

module.exports = QuotationItem;
