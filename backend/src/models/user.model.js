'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id:            { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  username:      { type: DataTypes.STRING(50), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  full_name:     { type: DataTypes.STRING(100), allowNull: false },
  email:         { type: DataTypes.STRING(100) },
  role:          { type: DataTypes.ENUM('admin', 'manager', 'billing', 'viewer'), defaultValue: 'billing' },
  is_active:     { type: DataTypes.BOOLEAN, defaultValue: true },
  last_login:    { type: DataTypes.DATE },
}, { tableName: 'users' });

module.exports = User;
