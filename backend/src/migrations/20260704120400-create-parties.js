'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parties', {
      id:               { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      party_code:       { type: Sequelize.STRING(20), allowNull: false, unique: true },
      name:             { type: Sequelize.STRING(150), allowNull: false },
      address1:         Sequelize.STRING(200),
      address2:         Sequelize.STRING(200),
      address3:         Sequelize.STRING(200),
      address4:         Sequelize.STRING(200),
      city:             Sequelize.STRING(80),
      state:            Sequelize.STRING(60),
      state_code:       Sequelize.STRING(4),
      pincode:          Sequelize.STRING(10),
      phone:            Sequelize.STRING(20),
      mobile:           Sequelize.STRING(20),
      email:            Sequelize.STRING(100),
      party_type:       { type: Sequelize.ENUM('customer', 'supplier', 'both'), defaultValue: 'customer' },
      gst_number:       Sequelize.STRING(20),
      drug_license_no:  Sequelize.STRING(50),
      drug_license_no2: Sequelize.STRING(50),
      pan_no:           Sequelize.STRING(15),
      food_license_no:  Sequelize.STRING(50),
      area_id:          { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'areas', key: 'id' }, onDelete: 'RESTRICT' },
      salesman_id:      { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'salesmen', key: 'id' }, onDelete: 'RESTRICT' },
      credit_limit:     { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      credit_days:      { type: Sequelize.INTEGER, defaultValue: 0 },
      discount_pct:     { type: Sequelize.DECIMAL(5, 2), defaultValue: 0 },
      opening_debit:    { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      opening_credit:   { type: Sequelize.DECIMAL(12, 2), defaultValue: 0 },
      is_active:        { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at:       { type: Sequelize.DATE, allowNull: false },
      updated_at:       { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('parties', ['party_code']);
    await queryInterface.addIndex('parties', ['name']);
  },
  async down(queryInterface) { await queryInterface.dropTable('parties'); },
};
