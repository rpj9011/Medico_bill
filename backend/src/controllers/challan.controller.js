'use strict';
const sequelize = require('../config/database');
const { Challan, ChallanItem, Party, Product } = require('../models');
const { getNextVoucherNo, VOUCHER_TYPES } = require('../services/invoiceNumbering.service');
const { Op } = require('sequelize');

const include = [
  { model: Party, as: 'customer', attributes: ['party_code', 'name', 'gst_number'] },
  {
    model: ChallanItem,
    include: [{ model: Product, attributes: ['product_code', 'product_name', 'pack'] }],
  },
];

async function list(req, res, next) {
  try {
    const { from_date, to_date, customer_id, status, page = 1, limit = 50 } = req.query;
    const where = {};
    if (customer_id) where.customer_id = customer_id;
    if (status)      where.status = status;
    if (from_date || to_date) {
      where.challan_date = {};
      if (from_date) where.challan_date[Op.gte] = from_date;
      if (to_date)   where.challan_date[Op.lte] = to_date;
    }
    const { count, rows } = await Challan.findAndCountAll({
      where,
      include: [{ model: Party, as: 'customer', attributes: ['name'] }],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['challan_date', 'DESC']],
    });
    res.json({ success: true, data: rows, total: count });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const challan = await Challan.findByPk(req.params.id, { include });
    if (!challan) return res.status(404).json({ success: false, message: 'Challan not found' });
    res.json({ success: true, data: challan });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { customer_id, challan_date, transport, lr_no, narration, godown_id, salesman_id, items = [] } = req.body;

    const voucher_no = await getNextVoucherNo(VOUCHER_TYPES.CHALLAN, t);

    const challan = await Challan.create({
      voucher_no, customer_id, challan_date, transport, lr_no, narration,
      godown_id, salesman_id, status: 'open',
    }, { transaction: t });

    for (const item of items) {
      await ChallanItem.create({
        challan_id: challan.id,
        product_id: item.product_id,
        batch_no:   item.batch_no || null,
        quantity:   item.quantity,
        mrp:        item.mrp || 0,
        rate:       item.rate || 0,
        line_total: item.line_total || 0,
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, data: { id: challan.id, voucher_no } });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const challan = await Challan.findByPk(req.params.id);
    if (!challan) return res.status(404).json({ success: false, message: 'Challan not found' });
    if (challan.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot edit a cancelled challan' });
    }
    await challan.update(req.body);
    res.json({ success: true, data: challan });
  } catch (err) { next(err); }
}

async function cancel(req, res, next) {
  try {
    const challan = await Challan.findByPk(req.params.id);
    if (!challan) return res.status(404).json({ success: false, message: 'Challan not found' });
    await challan.update({ status: 'cancelled' });
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, cancel };
