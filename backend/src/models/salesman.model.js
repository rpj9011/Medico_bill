'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Salesman = sequelize.define('Salesman', {
  id:             { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  salesman_code:  { type: DataTypes.STRING(20), allowNull: false, unique: true },
  salesman_name:  { type: DataTypes.STRING(100), allowNull: false },
  commission_pct: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  phone:          { type: DataTypes.STRING(20) },
  is_active:      { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'salesmen' });

module.exports = Salesman;
