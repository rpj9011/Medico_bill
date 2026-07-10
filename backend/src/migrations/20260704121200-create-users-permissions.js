'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id:            { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      username:      { type: Sequelize.STRING(50), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      full_name:     { type: Sequelize.STRING(100), allowNull: false },
      email:         Sequelize.STRING(100),
      role:          { type: Sequelize.ENUM('admin', 'manager', 'billing', 'viewer'), defaultValue: 'billing' },
      is_active:     { type: Sequelize.BOOLEAN, defaultValue: true },
      last_login:    Sequelize.DATE,
      created_at:    { type: Sequelize.DATE, allowNull: false },
      updated_at:    { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('role_permissions', {
      id:         { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id:    { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      module:     { type: Sequelize.STRING(50), allowNull: false },
      can_view:   { type: Sequelize.BOOLEAN, defaultValue: false },
      can_create: { type: Sequelize.BOOLEAN, defaultValue: false },
      can_edit:   { type: Sequelize.BOOLEAN, defaultValue: false },
      can_delete: { type: Sequelize.BOOLEAN, defaultValue: false },
      can_print:  { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('role_permissions', ['user_id', 'module'], { unique: true });

    await queryInterface.createTable('voucher_sequences', {
      id:             { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      voucher_type:   { type: Sequelize.STRING(50), allowNull: false, unique: true },
      prefix:         { type: Sequelize.STRING(10), defaultValue: '' },
      suffix:         { type: Sequelize.STRING(10), defaultValue: '' },
      current_no:     { type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0 },
      financial_year: Sequelize.STRING(10),
      reset_yearly:   { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at:     { type: Sequelize.DATE, allowNull: false },
      updated_at:     { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('voucher_sequences');
    await queryInterface.dropTable('role_permissions');
    await queryInterface.dropTable('users');
  },
};
