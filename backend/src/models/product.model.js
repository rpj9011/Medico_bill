'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id:                  { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  product_code:        { type: DataTypes.STRING(30), allowNull: false, unique: true },
  product_name:        { type: DataTypes.STRING(200), allowNull: false },
  pack:                { type: DataTypes.STRING(30) },          // e.g. "10x10", "30ml"
  uom:                 { type: DataTypes.STRING(20) },          // unit of measure
  company_id:          { type: DataTypes.INTEGER.UNSIGNED },
  hsn_code:            { type: DataTypes.STRING(10) },
  sgst_pct:            { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  cgst_pct:            { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  igst_pct:            { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  cess_pct:            { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  mrp:                 { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  purchase_rate:       { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  sale_rate:           { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  ptr:                 { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }, // price to retailer
  min_level:           { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  max_level:           { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  is_dpco_controlled:  { type: DataTypes.BOOLEAN, defaultValue: false },
  dpco_price_ceiling:  { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  is_schedule_drug:    { type: DataTypes.BOOLEAN, defaultValue: false },
  barcode:             { type: DataTypes.STRING(50) },
  rack_location:       { type: DataTypes.STRING(30) },
  is_active:           { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'products' });

module.exports = Product;
