'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockBatch = sequelize.define('StockBatch', {
  id:                { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  product_id:        { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  batch_no:          { type: DataTypes.STRING(50), allowNull: false },
  expiry_date:       { type: DataTypes.DATEONLY, allowNull: false },
  godown_id:         { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  mrp:               { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  purchase_rate:     { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  sale_rate:         { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  ptr:               { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  quantity_on_hand:  { type: DataTypes.DECIMAL(10, 3), defaultValue: 0 },
  min_stock_qty:     { type: DataTypes.DECIMAL(10, 3), defaultValue: 0 },
}, {
  tableName: 'stock_batches',
  indexes: [
    { unique: true, fields: ['product_id', 'batch_no', 'godown_id'] },
  ],
});

module.exports = StockBatch;
