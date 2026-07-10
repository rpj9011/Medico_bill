'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Party = sequelize.define('Party', {
  id:               { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  party_code:       { type: DataTypes.STRING(20), allowNull: false, unique: true },
  name:             { type: DataTypes.STRING(150), allowNull: false },
  address1:         { type: DataTypes.STRING(200) },
  address2:         { type: DataTypes.STRING(200) },
  address3:         { type: DataTypes.STRING(200) },
  address4:         { type: DataTypes.STRING(200) },
  city:             { type: DataTypes.STRING(80) },
  state:            { type: DataTypes.STRING(60) },
  state_code:       { type: DataTypes.STRING(4) },
  pincode:          { type: DataTypes.STRING(10) },
  phone:            { type: DataTypes.STRING(20) },
  mobile:           { type: DataTypes.STRING(20) },
  email:            { type: DataTypes.STRING(100) },
  party_type:       { type: DataTypes.ENUM('customer', 'supplier', 'both'), defaultValue: 'customer' },
  gst_number:       { type: DataTypes.STRING(20) },
  drug_license_no:  { type: DataTypes.STRING(50) },
  drug_license_no2: { type: DataTypes.STRING(50) },
  pan_no:           { type: DataTypes.STRING(15) },
  food_license_no:  { type: DataTypes.STRING(50) },
  area_id:          { type: DataTypes.INTEGER.UNSIGNED },
  salesman_id:      { type: DataTypes.INTEGER.UNSIGNED },
  credit_limit:     { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  credit_days:      { type: DataTypes.INTEGER, defaultValue: 0 },
  discount_pct:     { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  opening_debit:    { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  opening_credit:   { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  is_active:        { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'parties' });

module.exports = Party;
