'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  company_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  company_name: { type: DataTypes.STRING(150), allowNull: false },
  gst_number:   { type: DataTypes.STRING(20) },
  phone:        { type: DataTypes.STRING(20) },
  email:        { type: DataTypes.STRING(100) },
  address:      { type: DataTypes.TEXT },
  is_active:    { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'companies' });

module.exports = Company;
