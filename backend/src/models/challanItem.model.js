'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChallanItem = sequelize.define('ChallanItem', {
  id:          { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  challan_id:  { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  product_id:  { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  batch_no:    { type: DataTypes.STRING(50) },
  quantity:    { type: DataTypes.DECIMAL(10, 3), allowNull: false },
  mrp:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  rate:        { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  line_total:  { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
}, { tableName: 'challan_items' });

module.exports = ChallanItem;
