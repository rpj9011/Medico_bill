'use strict';
const sequelize = require('../config/database');
const { Quotation, QuotationItem, Party, Product } = require('../models');
const { getNextVoucherNo, VOUCHER_TYPES } = require('../services/invoiceNumbering.service');
const { Op } = require('sequelize');

const include = [
  { model: Party, as: 'customer', attributes: ['party_code', 'name', 'gst_number'] },
  {
    model: QuotationItem,
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
      where.quotation_date = {};
      if (from_date) where.quotation_date[Op.gte] = from_date;
      if (to_date)   where.quotation_date[Op.lte] = to_date;
    }
    const { count, rows } = await Quotation.findAndCountAll({
      where,
      include: [{ model: Party, as: 'customer', attributes: ['name'] }],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['quotation_date', 'DESC']],
    });
    res.json({ success: true, data: rows, total: count });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const quot = await Quotation.findByPk(req.params.id, { include });
    if (!quot) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, data: quot });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const {
      customer_id, quotation_date, valid_till, narration, salesman_id, items = [],
    } = req.body;

    const voucher_no = await getNextVoucherNo(VOUCHER_TYPES.QUOTATION, t);

    // calculate totals
    let gross = 0, discAmt = 0, gstAmt = 0, net = 0;
    const itemData = [];
    for (const item of items) {
      const lineGross   = Number(item.rate) * Number(item.quantity);
      const lineDisc    = lineGross * (Number(item.discount_pct) || 0) / 100;
      const lineTaxable = lineGross - lineDisc;
      const lineGst     = lineTaxable * (Number(item.gst_pct) || 0) / 100;
      const lineTotal   = lineTaxable + lineGst;
      gross   += lineGross;
      discAmt += lineDisc;
      gstAmt  += lineGst;
      net     += lineTotal;
      itemData.push({
        product_id:   item.product_id,
        quantity:     item.quantity,
        mrp:          item.mrp || 0,
        rate:         item.rate,
        discount_pct: item.discount_pct || 0,
        gst_pct:      item.gst_pct || 0,
        line_total:   Math.round(lineTotal * 100) / 100,
      });
    }

    const quot = await Quotation.create({
      voucher_no, customer_id, quotation_date, valid_till, narration, salesman_id,
      gross_amount:    Math.round(gross   * 100) / 100,
      discount_amount: Math.round(discAmt * 100) / 100,
      gst_amount:      Math.round(gstAmt  * 100) / 100,
      net_amount:      Math.round(net     * 100) / 100,
      status: 'draft',
    }, { transaction: t });

    for (const item of itemData) {
      await QuotationItem.create({ quotation_id: quot.id, ...item }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, data: { id: quot.id, voucher_no } });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const quot = await Quotation.findByPk(req.params.id);
    if (!quot) return res.status(404).json({ success: false, message: 'Quotation not found' });
    if (quot.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot edit a cancelled quotation' });
    }
    await quot.update(req.body);
    res.json({ success: true, data: quot });
  } catch (err) { next(err); }
}

async function cancel(req, res, next) {
  try {
    const quot = await Quotation.findByPk(req.params.id);
    if (!quot) return res.status(404).json({ success: false, message: 'Quotation not found' });
    await quot.update({ status: 'cancelled' });
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, cancel };
