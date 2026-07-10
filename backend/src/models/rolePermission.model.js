'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolePermission = sequelize.define('RolePermission', {
  id:         { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  user_id:    { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  module:     { type: DataTypes.STRING(50), allowNull: false },
  can_view:   { type: DataTypes.BOOLEAN, defaultValue: false },
  can_create: { type: DataTypes.BOOLEAN, defaultValue: false },
  can_edit:   { type: DataTypes.BOOLEAN, defaultValue: false },
  can_delete: { type: DataTypes.BOOLEAN, defaultValue: false },
  can_print:  { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'role_permissions',
  indexes: [{ unique: true, fields: ['user_id', 'module'] }],
});

module.exports = RolePermission;
