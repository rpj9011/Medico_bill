'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompanyContact = sequelize.define('CompanyContact', {
  id:           { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  company_id:   { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  contact_name: { type: DataTypes.STRING(100), allowNull: false },
  designation:  { type: DataTypes.STRING(60) },
  phone:        { type: DataTypes.STRING(20) },
  email:        { type: DataTypes.STRING(100) },
}, { tableName: 'company_contacts' });

module.exports = CompanyContact;
