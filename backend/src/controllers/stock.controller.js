'use strict';
const { StockBatch, StockMovement, Product, Godown } = require('../models');
const { Op } = require('sequelize');

async function stockSummary(req, res, next) {
  try {
    const { product_id, godown_id, low_stock, search } = req.query;
    const where = { quantity_on_hand: { [Op.gt]: 0 } };
    if (product_id) where.product_id = product_id;
    if (godown_id)  where.godown_id  = godown_id;

    // Build product-level search filter
    const productWhere = {};
    if (search) {
      productWhere[Op.or] = [
        { product_name: { [Op.like]: `%${search}%` } },
        { product_code: { [Op.like]: `%${search}%` } },
        { hsn_code:     { [Op.like]: `%${search}%` } },
        { barcode:      { [Op.like]: `%${search}%` } },
      ];
    }

    const batches = await StockBatch.findAll({
      where,
      include: [
        {
          model: Product,
          attributes: ['product_code', 'product_name', 'pack', 'min_level', 'hsn_code',
                       'sgst_pct', 'cgst_pct', 'igst_pct', 'cess_pct', 'is_dpco_controlled',
                       'sale_rate', 'mrp', 'ptr'],
          where: Object.keys(productWhere).length ? productWhere : undefined,
          required: Object.keys(productWhere).length > 0,
        },
        { model: Godown, attributes: ['godown_name'] },
      ],
      order: [['expiry_date', 'ASC']],
    });

    let results = batches;
    if (low_stock === 'true') {
      results = batches.filter(b => Number(b.quantity_on_hand) <= Number(b.Product?.min_level || 0));
    }

    res.json({ success: true, data: results });
  } catch (err) { next(err); }
}

/**
 * Search products that have available stock.
 * Groups batches by product and returns each product once,
 * with its batches array attached — ready for the billing screen.
 */
async function searchStockProducts(req, res, next) {
  try {
    const { search, godown_id, limit = 10 } = req.query;
    if (!search || search.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const today = new Date();
    const stockWhere = { quantity_on_hand: { [Op.gt]: 0 }, expiry_date: { [Op.gte]: today } };
    if (godown_id) stockWhere.godown_id = godown_id;

    const productWhere = {
      is_active: true,
      [Op.or]: [
        { product_name: { [Op.like]: `%${search}%` } },
        { product_code: { [Op.like]: `%${search}%` } },
        { hsn_code:     { [Op.like]: `%${search}%` } },
        { barcode:      { [Op.like]: `%${search}%` } },
      ],
    };

    const batches = await StockBatch.findAll({
      where: stockWhere,
      include: [{
        model: Product,
        attributes: [
          'id', 'product_code', 'product_name', 'pack', 'hsn_code',
          'sgst_pct', 'cgst_pct', 'igst_pct', 'cess_pct',
          'is_dpco_controlled', 'sale_rate', 'mrp', 'ptr',
        ],
        where: productWhere,
        required: true,
      }],
      order: [['expiry_date', 'ASC']],
    });

    // Group batches by product_id
    const productMap = new Map();
    for (const batch of batches) {
      const pid = batch.product_id;
      if (!productMap.has(pid)) {
        productMap.set(pid, {
          id:                batch.Product.id,
          product_code:      batch.Product.product_code,
          product_name:      batch.Product.product_name,
          pack:              batch.Product.pack,
          hsn_code:          batch.Product.hsn_code,
          sgst_pct:          batch.Product.sgst_pct,
          cgst_pct:          batch.Product.cgst_pct,
          igst_pct:          batch.Product.igst_pct,
          cess_pct:          batch.Product.cess_pct,
          is_dpco_controlled: batch.Product.is_dpco_controlled,
          sale_rate:         batch.Product.sale_rate,
          mrp:               batch.Product.mrp,
          ptr:               batch.Product.ptr,
          batches:           [],
        });
      }
      productMap.get(pid).batches.push({
        batch_no:        batch.batch_no,
        expiry_date:     batch.expiry_date,
        mrp:             batch.mrp,
        sale_rate:       batch.sale_rate,
        ptr:             batch.ptr,
        purchase_rate:   batch.purchase_rate,
        quantity_on_hand: batch.quantity_on_hand,
        godown_id:       batch.godown_id,
      });
    }

    const results = [...productMap.values()].slice(0, Number(limit));
    res.json({ success: true, data: results });
  } catch (err) { next(err); }
}

async function expiryAlert(req, res, next) {
  try {
    const { days = 90 } = req.query;
    const alertDate = new Date();
    alertDate.setDate(alertDate.getDate() + Number(days));

    const batches = await StockBatch.findAll({
      where: {
        expiry_date:      { [Op.lte]: alertDate },
        quantity_on_hand: { [Op.gt]: 0 },
      },
      include: [
        { model: Product, attributes: ['product_name', 'product_code'] },
        { model: Godown,  attributes: ['godown_name'] },
      ],
      order: [['expiry_date', 'ASC']],
    });

    res.json({ success: true, data: batches });
  } catch (err) { next(err); }
}

async function movementLedger(req, res, next) {
  try {
    const { product_id, batch_id, from_date, to_date } = req.query;
    const where = {};
    if (batch_id) where.stock_batch_id = batch_id;
    if (from_date || to_date) {
      where.movement_date = {};
      if (from_date) where.movement_date[Op.gte] = from_date;
      if (to_date)   where.movement_date[Op.lte] = to_date;
    }

    const movements = await StockMovement.findAll({
      where,
      include: [{
        model: StockBatch,
        include: [{ model: Product, attributes: ['product_name'] }],
        where: product_id ? { product_id } : undefined,
        required: !!product_id,
      }],
      order: [['movement_date', 'ASC'], ['id', 'ASC']],
    });

    res.json({ success: true, data: movements });
  } catch (err) { next(err); }
}

module.exports = { stockSummary, expiryAlert, movementLedger, searchStockProducts };
