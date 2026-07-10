'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id:              { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  stock_batch_id:  { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  movement_type:   {
    type: DataTypes.ENUM(
      'purchase', 'purchase_return',
      'sale', 'sale_return',
      'transfer_in', 'transfer_out',
      'adjustment_in', 'adjustment_out',
      'opening'
    ),
    allowNull: false,
  },
  quantity:          { type: DataTypes.DECIMAL(10, 3), allowNull: false },
  reference_type:    { type: DataTypes.STRING(50) },  // 'purchase_invoice', 'sales_invoice', etc.
  reference_id:      { type: DataTypes.INTEGER.UNSIGNED },
  movement_date:     { type: DataTypes.DATEONLY, allowNull: false },
  narration:         { type: DataTypes.STRING(255) },
}, { tableName: 'stock_movements' });

module.exports = StockMovement;
