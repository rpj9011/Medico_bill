'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id:           { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      company_code: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      company_name: { type: Sequelize.STRING(150), allowNull: false },
      gst_number:   { type: Sequelize.STRING(20) },
      phone:        { type: Sequelize.STRING(20) },
      email:        { type: Sequelize.STRING(100) },
      address:      { type: Sequelize.TEXT },
      is_active:    { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at:   { type: Sequelize.DATE, allowNull: false },
      updated_at:   { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable('company_contacts', {
      id:           { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      company_id:   { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'companies', key: 'id' }, onDelete: 'CASCADE' },
      contact_name: { type: Sequelize.STRING(100), allowNull: false },
      designation:  { type: Sequelize.STRING(60) },
      phone:        { type: Sequelize.STRING(20) },
      email:        { type: Sequelize.STRING(100) },
      created_at:   { type: Sequelize.DATE, allowNull: false },
      updated_at:   { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('company_contacts');
    await queryInterface.dropTable('companies');
  },
};
