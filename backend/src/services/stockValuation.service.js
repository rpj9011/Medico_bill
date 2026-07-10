'use strict';
/**
 * Stock / batch management.
 * Implements FEFO (First Expiry First Out) batch selection.
 */
const { StockBatch, StockMovement, Product } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Get available batches for a product (sorted FEFO).
 * Returns only batches with qty > 0 and not yet expired.
 *
 * @param {number} productId
 * @param {number} [godownId]  - filter to specific godown if provided
 * @param {boolean} [includeExpired] - allow expired batches (for returns)
 */
async function getAvailableBatches(productId, godownId = null, includeExpired = false) {
  const where = { product_id: productId, quantity_on_hand: { [Op.gt]: 0 } };
  if (godownId) where.godown_id = godownId;
  if (!includeExpired) where.expiry_date = { [Op.gte]: new Date() };

  return StockBatch.findAll({
    where,
    order: [['expiry_date', 'ASC']],   // FEFO
    include: [{ association: 'Godown', attributes: ['godown_name'] }],
  });
}

/**
 * Decrement stock for a sale line.
 * Validates that enough stock exists (in the specified batch).
 *
 * @param {object} params
 * @param {number} params.productId
 * @param {string} params.batchNo
 * @param {number} params.godownId
 * @param {number} params.quantity     - total qty (billed + free)
 * @param {string} params.referenceType
 * @param {number} params.referenceId
 * @param {Date}   params.movementDate
 * @param {object} params.transaction  - Sequelize transaction
 */
async function decrementStock({ productId, batchNo, godownId, quantity, referenceType, referenceId, movementDate, transaction }) {
  const batch = await StockBatch.findOne({
    where: { product_id: productId, batch_no: batchNo, godown_id: godownId },
    lock: true,
    transaction,
  });

  if (!batch) throw new Error(`Batch not found: product ${productId}, batch ${batchNo}`);
  if (Number(batch.quantity_on_hand) < quantity) {
    throw new Error(`Insufficient stock in batch ${batchNo}. Available: ${batch.quantity_on_hand}, Required: ${quantity}`);
  }

  await batch.update(
    { quantity_on_hand: Number(batch.quantity_on_hand) - quantity },
    { transaction }
  );

  await StockMovement.create({
    stock_batch_id: batch.id,
    movement_type:  'sale',
    quantity:       -quantity,
    reference_type: referenceType,
    reference_id:   referenceId,
    movement_date:  movementDate,
  }, { transaction });

  return batch;
}

/**
 * Increment stock for a purchase / sales return.
 */
async function incrementStock({ productId, batchNo, godownId, quantity, mrp, purchaseRate, saleRate, ptr, expiryDate, referenceType, referenceId, movementDate, movementTypeOverride, transaction }) {
  let batch = await StockBatch.findOne({
    where: { product_id: productId, batch_no: batchNo, godown_id: godownId },
    lock: true,
    transaction,
  });

  if (!batch) {
    batch = await StockBatch.create({
      product_id: productId, batch_no: batchNo, godown_id: godownId,
      expiry_date: expiryDate, mrp, purchase_rate: purchaseRate,
      sale_rate: saleRate, ptr, quantity_on_hand: 0,
    }, { transaction });
  }

  await batch.update(
    { quantity_on_hand: Number(batch.quantity_on_hand) + quantity },
    { transaction }
  );

  await StockMovement.create({
    stock_batch_id: batch.id,
    movement_type:  movementTypeOverride || 'purchase',
    quantity:       quantity,
    reference_type: referenceType,
    reference_id:   referenceId,
    movement_date:  movementDate,
  }, { transaction });

  return batch;
}

module.exports = { getAvailableBatches, decrementStock, incrementStock };
