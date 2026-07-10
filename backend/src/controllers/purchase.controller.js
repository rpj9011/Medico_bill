'use strict';
const sequelize = require('../config/database');
const { PurchaseInvoice, PurchaseInvoiceItem, Party, Product, LedgerEntry } = require('../models');
const { getNextVoucherNo, VOUCHER_TYPES } = require('../services/invoiceNumbering.service');
const { incrementStock } = require('../services/stockValuation.service');
const { Op } = require('sequelize');

const include = [
  { model: Party, as: 'supplier', attributes: ['party_code', 'name', 'gst_number'] },
  {
    model: PurchaseInvoiceItem,
    include: [{ model: Product, attributes: ['product_code', 'product_name', 'hsn_code'] }],
  },
];

async function list(req, res, next) {
  try {
    const { from_date, to_date, supplier_id, page = 1, limit = 50 } = req.query;
    const where = {};
    if (supplier_id) where.supplier_id = supplier_id;
    if (from_date || to_date) {
      where.bill_date = {};
      if (from_date) where.bill_date[Op.gte] = from_date;
      if (to_date)   where.bill_date[Op.lte] = to_date;
    }

    const { count, rows } = await PurchaseInvoice.findAndCountAll({
      where,
      include: [{ model: Party, as: 'supplier', attributes: ['name'] }],
      limit: Number(limit), offset: (Number(page) - 1) * Number(limit),
      order: [['bill_date', 'DESC']],
    });
    res.json({ success: true, data: rows, total: count });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const inv = await PurchaseInvoice.findByPk(req.params.id, { include });
    if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: inv });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const {
      supplier_id, bill_no, bill_date, godown_id,
      items, freight = 0, other_charges = 0, narration,
      lr_no, transport, eway_bill_no,
    } = req.body;

    const voucher_no = await getNextVoucherNo(VOUCHER_TYPES.PURCHASE, t);

    let gross = 0, discAmt = 0, sgst = 0, cgst = 0, igst = 0, cess = 0;
    const itemData = [];

    for (const item of items) {
      gross  += Number(item.grossAmount || 0);
      discAmt += Number(item.discountAmount || 0);
      sgst   += Number(item.sgstAmount || 0);
      cgst   += Number(item.cgstAmount || 0);
      igst   += Number(item.igstAmount || 0);
      cess   += Number(item.cessAmount || 0);
      itemData.push({
        product_id: item.product_id, batch_no: item.batch_no, expiry_date: item.expiry_date,
        quantity: item.quantity, free_quantity: item.free_quantity || 0,
        mrp: item.mrp, purchase_rate: item.purchase_rate, ptr: item.ptr,
        discount_pct: item.discount_pct || 0, discount_amount: item.discountAmount || 0,
        taxable_amount: item.taxableAmount || 0,
        sgst_pct: item.sgst_pct || 0, sgst_amount: item.sgstAmount || 0,
        cgst_pct: item.cgst_pct || 0, cgst_amount: item.cgstAmount || 0,
        igst_pct: item.igst_pct || 0, igst_amount: item.igstAmount || 0,
        cess_pct: item.cess_pct || 0, cess_amount: item.cessAmount || 0,
        line_total: item.lineTotal || 0, hsn_code: item.hsn_code,
      });
    }

    const taxable    = gross - discAmt;
    const gstTotal   = sgst + cgst + igst + cess;
    const rawNet     = taxable + gstTotal + Number(freight) + Number(other_charges);
    const roundOff   = Math.round(rawNet) - rawNet;
    const netAmount  = rawNet + roundOff;

    const invoice = await PurchaseInvoice.create({
      voucher_no, bill_no, bill_date, supplier_id, godown_id,
      gross_amount: gross, discount_amount: discAmt,
      sgst_amount: sgst, cgst_amount: cgst, igst_amount: igst, cess_amount: cess,
      freight, other_charges, round_off: Math.round(roundOff * 100) / 100,
      net_amount: Math.round(netAmount * 100) / 100,
      amount_paid: 0, amount_balance: Math.round(netAmount * 100) / 100,
      lr_no, transport, eway_bill_no, narration,
    }, { transaction: t });

    for (const item of itemData) {
      await PurchaseInvoiceItem.create({ purchase_invoice_id: invoice.id, ...item }, { transaction: t });
      // update stock
      const totalQty = Number(item.quantity) + Number(item.free_quantity);
      await incrementStock({
        productId: item.product_id, batchNo: item.batch_no, godownId: godown_id || 1,
        quantity: totalQty, mrp: item.mrp, purchaseRate: item.purchase_rate,
        saleRate: item.mrp * 0.9, ptr: item.ptr,
        expiryDate: item.expiry_date,
        referenceType: 'purchase_invoice', referenceId: invoice.id,
        movementDate: bill_date, transaction: t,
      });
    }

    // Post to party ledger (debit supplier)
    await LedgerEntry.create({
      party_id: supplier_id, transaction_date: bill_date,
      voucher_type: 'Purchase', voucher_no,
      debit_amount: 0, credit_amount: Math.round(netAmount * 100) / 100,
      narration: `Purchase bill ${bill_no}`,
      reference_type: 'purchase_invoice', reference_id: invoice.id,
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, data: { id: invoice.id, voucher_no } });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const inv = await PurchaseInvoice.findByPk(req.params.id);
    if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' });
    await inv.update({ is_cancelled: true });
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, cancel };
