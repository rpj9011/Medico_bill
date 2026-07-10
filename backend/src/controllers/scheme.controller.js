'use strict';
const { Scheme, Product } = require('../models');
const { Op } = require('sequelize');

const include = [{ model: Product, attributes: ['product_name', 'pack', 'is_dpco_controlled'], required: false }];

async function list(req, res, next) {
  try {
    const rows = await Scheme.findAll({ include, order: [['id', 'DESC']] });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const s = await Scheme.create(req.body);
    res.status(201).json({ success: true, data: s });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const s = await Scheme.findByPk(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Scheme not found' });
    await s.update(req.body);
    res.json({ success: true, data: s });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const s = await Scheme.findByPk(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Scheme not found' });
    await s.update({ is_active: false });
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove };
