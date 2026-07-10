'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_batches', {
      id:               { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      product_id:       { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'products', key: 'id' }, onDelete: 'RESTRICT' },
      batch_no:         { type: Sequelize.STRING(50), allowNull: false },
      expiry_date:      { type: Sequelize.DATEONLY, allowNull: false },
      godown_id:        { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'godowns', key: 'id' }, onDelete: 'RESTRICT' },
      mrp:              { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      purchase_rate:    { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      sale_rate:        { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      ptr:              { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      quantity_on_hand: { type: Sequelize.DECIMAL(10, 3), defaultValue: 0 },
      min_stock_qty:    { type: Sequelize.DECIMAL(10, 3), defaultValue: 0 },
      created_at:       { type: Sequelize.DATE, allowNull: false },
      updated_at:       { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('stock_batches', ['product_id', 'batch_no', 'godown_id'], { unique: true });

    await queryInterface.createTable('stock_movements', {
      id:             { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      stock_batch_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'stock_batches', key: 'id' }, onDelete: 'RESTRICT' },
      movement_type:  {
        type: Sequelize.ENUM('purchase', 'purchase_return', 'sale', 'sale_return', 'transfer_in', 'transfer_out', 'adjustment_in', 'adjustment_out', 'opening'),
        allowNull: false,
      },
      quantity:       { type: Sequelize.DECIMAL(10, 3), allowNull: false },
      reference_type: Sequelize.STRING(50),
      reference_id:   Sequelize.INTEGER.UNSIGNED,
      movement_date:  { type: Sequelize.DATEONLY, allowNull: false },
      narration:      Sequelize.STRING(255),
      created_at:     { type: Sequelize.DATE, allowNull: false },
      updated_at:     { type: Sequelize.DATE, allowNull: false },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('stock_movements');
    await queryInterface.dropTable('stock_batches');
  },
};
