'use strict';
const { Product, Company, StockBatch } = require('../models');
const { Op } = require('sequelize');

const include = [{ model: Company, attributes: ['company_code', 'company_name'], required: false }];

async function list(req, res, next) {
  try {
    const { search, company_id, page = 1, limit = 50 } = req.query;
    const where = { is_active: true };
    if (company_id) where.company_id = company_id;
    if (search) where[Op.or] = [
      { product_name: { [Op.like]: `%${search}%` } },
      { product_code: { [Op.like]: `%${search}%` } },
      { hsn_code:     { [Op.like]: `%${search}%` } },
      { barcode:      { [Op.like]: `%${search}%` } },
    ];

    const { count, rows } = await Product.findAndCountAll({
      where, include,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['product_name', 'ASC']],
    });
    res.json({ success: true, data: rows, total: count });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id, { include });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.update(req.body);
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await product.update({ is_active: false });
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function getBatches(req, res, next) {
  try {
    const { godown_id, include_expired } = req.query;
    const { getAvailableBatches } = require('../services/stockValuation.service');
    const batches = await getAvailableBatches(
      req.params.id,
      godown_id ? Number(godown_id) : null,
      include_expired === 'true'
    );
    res.json({ success: true, data: batches });
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove, getBatches };
