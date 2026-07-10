'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Godown = sequelize.define('Godown', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  godown_code:  { type: DataTypes.STRING(20), allowNull: false, unique: true },
  godown_name:  { type: DataTypes.STRING(100), allowNull: false },
  address:      { type: DataTypes.TEXT },
  is_active:    { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'godowns' });

module.exports = Godown;
