'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Scheme = sequelize.define('Scheme', {
  id:               { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  product_id:       { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  scheme_qty:       { type: DataTypes.DECIMAL(10, 3), allowNull: false },  // buy qty
  scheme_free_qty:  { type: DataTypes.DECIMAL(10, 3), defaultValue: 0 },  // free qty
  discount_pct:     { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  valid_from:       { type: DataTypes.DATEONLY },
  valid_to:         { type: DataTypes.DATEONLY },
  is_active:        { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'schemes' });

module.exports = Scheme;
