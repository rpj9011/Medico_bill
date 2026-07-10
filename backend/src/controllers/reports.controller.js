'use strict';
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const { SalesInvoice, SalesInvoiceItem, PurchaseInvoice, PurchaseInvoiceItem, Party, Product } = require('../models');

async function salesRegister(req, res, next) {
  try {
    const { from_date, to_date, voucher_type, salesman_id } = req.query;
    const where = { is_cancelled: false };
    if (voucher_type) where.voucher_type = voucher_type;
    if (salesman_id)  where.salesman_id  = salesman_id;
    if (from_date || to_date) {
      where.invoice_date = {};
      if (from_date) where.invoice_date[Op.gte] = from_date;
      if (to_date)   where.invoice_date[Op.lte] = to_date;
    }

    const invoices = await SalesInvoice.findAll({
      where,
      include: [{ model: Party, as: 'customer', attributes: ['name', 'gst_number'] }],
      order: [['invoice_date', 'ASC']],
    });

    const totals = invoices.reduce((acc, inv) => {
      acc.gross     += Number(inv.gross_amount);
      acc.discount  += Number(inv.discount_amount);
      acc.gst       += Number(inv.sgst_amount) + Number(inv.cgst_amount) + Number(inv.igst_amount);
      acc.net       += Number(inv.net_amount);
      return acc;
    }, { gross: 0, discount: 0, gst: 0, net: 0 });

    res.json({ success: true, data: invoices, totals });
  } catch (err) { next(err); }
}

async function purchaseRegister(req, res, next) {
  try {
    const { from_date, to_date, supplier_id } = req.query;
    const where = { is_cancelled: false };
    if (supplier_id) where.supplier_id = supplier_id;
    if (from_date || to_date) {
      where.bill_date = {};
      if (from_date) where.bill_date[Op.gte] = from_date;
      if (to_date)   where.bill_date[Op.lte] = to_date;
    }

    const invoices = await PurchaseInvoice.findAll({
      where,
      include: [{ model: Party, as: 'supplier', attributes: ['name', 'gst_number'] }],
      order: [['bill_date', 'ASC']],
    });

    res.json({ success: true, data: invoices });
  } catch (err) { next(err); }
}

async function gstSummary(req, res, next) {
  try {
    const { from_date, to_date, type = 'sale' } = req.query;

    if (type === 'sale') {
      const where = { is_cancelled: false };
      if (from_date) where.invoice_date = { ...where.invoice_date, [Op.gte]: from_date };
      if (to_date)   where.invoice_date = { ...where.invoice_date, [Op.lte]: to_date };

      const rows = await sequelize.query(`
        SELECT
          sii.hsn_code,
          SUM(sii.taxable_amount) AS taxable_amount,
          SUM(sii.sgst_amount)    AS sgst_amount,
          SUM(sii.cgst_amount)    AS cgst_amount,
          SUM(sii.igst_amount)    AS igst_amount,
          SUM(sii.cess_amount)    AS cess_amount
        FROM sales_invoice_items sii
        JOIN sales_invoices si ON si.id = sii.sales_invoice_id
        WHERE si.is_cancelled = 0
          ${from_date ? `AND si.invoice_date >= '${from_date}'` : ''}
          ${to_date   ? `AND si.invoice_date <= '${to_date}'`   : ''}
        GROUP BY sii.hsn_code
        ORDER BY sii.hsn_code
      `, { type: sequelize.QueryTypes.SELECT });

      res.json({ success: true, data: rows });
    } else {
      const rows = await sequelize.query(`
        SELECT
          pii.hsn_code,
          SUM(pii.taxable_amount) AS taxable_amount,
          SUM(pii.sgst_amount)    AS sgst_amount,
          SUM(pii.cgst_amount)    AS cgst_amount,
          SUM(pii.igst_amount)    AS igst_amount,
          SUM(pii.cess_amount)    AS cess_amount
        FROM purchase_invoice_items pii
        JOIN purchase_invoices pi ON pi.id = pii.purchase_invoice_id
        WHERE pi.is_cancelled = 0
          ${from_date ? `AND pi.bill_date >= '${from_date}'` : ''}
          ${to_date   ? `AND pi.bill_date <= '${to_date}'`   : ''}
        GROUP BY pii.hsn_code
        ORDER BY pii.hsn_code
      `, { type: sequelize.QueryTypes.SELECT });

      res.json({ success: true, data: rows });
    }
  } catch (err) { next(err); }
}

async function salesmanCollection(req, res, next) {
  try {
    const { from_date, to_date } = req.query;
    const rows = await sequelize.query(`
      SELECT
        s.id AS salesman_id,
        s.salesman_name,
        COUNT(si.id)        AS invoice_count,
        SUM(si.net_amount)  AS total_billed,
        SUM(si.amount_received) AS total_collected,
        SUM(si.amount_balance)  AS total_outstanding
      FROM salesmen s
      LEFT JOIN sales_invoices si ON si.salesman_id = s.id AND si.is_cancelled = 0
        ${from_date ? `AND si.invoice_date >= '${from_date}'` : ''}
        ${to_date   ? `AND si.invoice_date <= '${to_date}'`   : ''}
      GROUP BY s.id, s.salesman_name
      ORDER BY s.salesman_name
    `, { type: sequelize.QueryTypes.SELECT });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

module.exports = { salesRegister, purchaseRegister, gstSummary, salesmanCollection };
