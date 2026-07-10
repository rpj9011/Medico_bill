'use strict';
const sequelize = require('../config/database');
const { SalesInvoice, SalesInvoiceItem, Party, Product, Salesman, Godown, LedgerEntry } = require('../models');
const { getNextVoucherNo, VOUCHER_TYPES } = require('../services/invoiceNumbering.service');
const { decrementStock } = require('../services/stockValuation.service');
const { generateInvoicePDF } = require('../services/pdfInvoice.service');
const { Op } = require('sequelize');

function voucherTypeKey(type) {
  const map = { credit: VOUCHER_TYPES.SALES_CREDIT, cash: VOUCHER_TYPES.SALES_CASH, counter: VOUCHER_TYPES.SALES_COUNTER };
  return map[type] || VOUCHER_TYPES.SALES_CREDIT;
}

async function list(req, res, next) {
  try {
    const { from_date, to_date, customer_id, voucher_type, page = 1, limit = 50 } = req.query;
    const where = {};
    if (customer_id)  where.customer_id  = customer_id;
    if (voucher_type) where.voucher_type = voucher_type;
    if (from_date || to_date) {
      where.invoice_date = {};
      if (from_date) where.invoice_date[Op.gte] = from_date;
      if (to_date)   where.invoice_date[Op.lte] = to_date;
    }

    const { count, rows } = await SalesInvoice.findAndCountAll({
      where,
      include: [{ model: Party, as: 'customer', attributes: ['name'] }],
      limit: Number(limit), offset: (Number(page) - 1) * Number(limit),
      order: [['invoice_date', 'DESC']],
    });
    res.json({ success: true, data: rows, total: count });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const inv = await SalesInvoice.findByPk(req.params.id, {
      include: [
        { model: Party,    as: 'customer' },
        { model: Salesman, attributes: ['salesman_name'] },
        { model: Godown,   attributes: ['godown_name'] },
        {
          model: SalesInvoiceItem,
          include: [{ model: Product, attributes: ['product_code', 'product_name', 'hsn_code'] }],
        },
      ],
    });
    if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: inv });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const {
      customer_id, voucher_type = 'credit', invoice_date,
      salesman_id, godown_id, items,
      freight = 0, narration, amount_received = 0,
      cash_discount_amount = 0,
    } = req.body;

    const voucher_no  = await getNextVoucherNo(voucherTypeKey(voucher_type), t);
    const invoice_no  = voucher_no;

    let gross = 0, discAmt = 0, schemeDisc = 0, sgst = 0, cgst = 0, igst = 0, cess = 0;
    const itemData = [];

    for (const item of items) {
      gross      += Number(item.grossAmount || 0);
      discAmt    += Number(item.discountAmount || 0);
      schemeDisc += Number(item.schemeDiscountAmount || 0);
      sgst       += Number(item.sgstAmount || 0);
      cgst       += Number(item.cgstAmount || 0);
      igst       += Number(item.igstAmount || 0);
      cess       += Number(item.cessAmount || 0);
      itemData.push({
        product_id: item.product_id, batch_no: item.batch_no, expiry_date: item.expiry_date,
        quantity: item.quantity, free_quantity: item.free_quantity || 0,
        mrp: item.mrp, rate: item.rate, ptr: item.ptr,
        discount_pct: item.discount_pct || 0, discount_amount: item.discountAmount || 0,
        taxable_amount: item.taxableAmount || 0,
        sgst_pct: item.sgst_pct || 0, sgst_amount: item.sgstAmount || 0,
        cgst_pct: item.cgst_pct || 0, cgst_amount: item.cgstAmount || 0,
        igst_pct: item.igst_pct || 0, igst_amount: item.igstAmount || 0,
        cess_pct: item.cess_pct || 0, cess_amount: item.cessAmount || 0,
        line_total: item.lineTotal || 0, hsn_code: item.hsn_code,
        is_scheme_item: item.is_scheme_item || false,
      });
    }

    const taxable   = gross - discAmt - schemeDisc;
    const gstTotal  = sgst + cgst + igst + cess;
    const rawNet    = taxable + gstTotal + Number(freight) - Number(cash_discount_amount);
    const roundOff  = Math.round(rawNet) - rawNet;
    const netAmount = rawNet + roundOff;
    const balance   = netAmount - Number(amount_received);

    const invoice = await SalesInvoice.create({
      voucher_no, invoice_no, invoice_date, voucher_type,
      customer_id, salesman_id, godown_id,
      gross_amount: Math.round(gross * 100) / 100,
      discount_amount: Math.round(discAmt * 100) / 100,
      scheme_discount_amount: Math.round(schemeDisc * 100) / 100,
      cash_discount_amount: Math.round(Number(cash_discount_amount) * 100) / 100,
      sgst_amount: Math.round(sgst * 100) / 100,
      cgst_amount: Math.round(cgst * 100) / 100,
      igst_amount: Math.round(igst * 100) / 100,
      cess_amount: Math.round(cess * 100) / 100,
      freight, round_off: Math.round(roundOff * 100) / 100,
      net_amount: Math.round(netAmount * 100) / 100,
      amount_received, amount_balance: Math.round(balance * 100) / 100,
      narration,
    }, { transaction: t });

    for (const item of itemData) {
      await SalesInvoiceItem.create({ sales_invoice_id: invoice.id, ...item }, { transaction: t });
      const totalQty = Number(item.quantity) + Number(item.free_quantity);
      await decrementStock({
        productId: item.product_id, batchNo: item.batch_no,
        godownId: godown_id || 1,
        quantity: totalQty,
        referenceType: 'sales_invoice', referenceId: invoice.id,
        movementDate: invoice_date, transaction: t,
      });
    }

    // Post to party ledger (debit customer)
    await LedgerEntry.create({
      party_id: customer_id, transaction_date: invoice_date,
      voucher_type: 'Sale', voucher_no,
      debit_amount: Math.round(netAmount * 100) / 100, credit_amount: 0,
      narration: `Sales bill ${invoice_no}`,
      reference_type: 'sales_invoice', reference_id: invoice.id,
    }, { transaction: t });

    if (Number(amount_received) > 0) {
      await LedgerEntry.create({
        party_id: customer_id, transaction_date: invoice_date,
        voucher_type: 'Receipt', voucher_no: `RCP-${voucher_no}`,
        debit_amount: 0, credit_amount: Math.round(Number(amount_received) * 100) / 100,
        narration: `Cash received against ${invoice_no}`,
        reference_type: 'sales_invoice', reference_id: invoice.id,
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, data: { id: invoice.id, voucher_no, net_amount: Math.round(netAmount * 100) / 100 } });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function printPDF(req, res, next) {
  try {
    const inv = await SalesInvoice.findByPk(req.params.id, {
      include: [
        { model: Party, as: 'customer' },
        { model: Salesman, attributes: ['salesman_name'] },
        {
          model: SalesInvoiceItem,
          include: [{ model: Product, attributes: ['product_name', 'hsn_code'] }],
        },
      ],
    });
    if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' });

    const invoiceData = inv.toJSON();
    invoiceData.items = invoiceData.SalesInvoiceItems?.map(i => ({
      ...i,
      product_name: i.Product?.product_name,
      hsn_code: i.Product?.hsn_code || i.hsn_code,
    }));

    const businessInfo = {
      name:    process.env.BUSINESS_NAME    || 'Pharma Wholesale Pvt Ltd',
      address: process.env.BUSINESS_ADDRESS || '',
      gstin:   process.env.BUSINESS_GSTIN   || '',
      phone:   process.env.BUSINESS_PHONE   || '',
    };

    const pdfBuffer = await generateInvoicePDF(invoiceData, businessInfo);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${inv.voucher_no}.pdf"` });
    res.send(pdfBuffer);
  } catch (err) { next(err); }
}

async function cancel(req, res, next) {
  try {
    const inv = await SalesInvoice.findByPk(req.params.id);
    if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' });
    await inv.update({ is_cancelled: true });
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, printPDF, cancel };
