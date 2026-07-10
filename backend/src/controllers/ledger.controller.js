'use strict';
const sequelize = require('../config/database');
const { LedgerEntry, ReceiptPayment, CreditDebitNote, Party } = require('../models');
const { getNextVoucherNo, VOUCHER_TYPES } = require('../services/invoiceNumbering.service');
const { Op } = require('sequelize');

async function partyLedger(req, res, next) {
  try {
    const { party_id } = req.params;
    const { from_date, to_date } = req.query;
    const where = { party_id };
    if (from_date || to_date) {
      where.transaction_date = {};
      if (from_date) where.transaction_date[Op.gte] = from_date;
      if (to_date)   where.transaction_date[Op.lte] = to_date;
    }

    const entries = await LedgerEntry.findAll({ where, order: [['transaction_date', 'ASC'], ['id', 'ASC']] });

    // Running balance
    let balance = 0;
    const withBalance = entries.map(e => {
      balance += Number(e.debit_amount) - Number(e.credit_amount);
      return { ...e.toJSON(), running_balance: Math.round(balance * 100) / 100 };
    });

    res.json({ success: true, data: withBalance, closing_balance: Math.round(balance * 100) / 100 });
  } catch (err) { next(err); }
}

async function outstanding(req, res, next) {
  try {
    const { party_type, overdue_only } = req.query;
    const partyWhere = {};
    if (party_type) partyWhere.party_type = { [Op.in]: [party_type, 'both'] };

    const parties = await Party.findAll({ where: { ...partyWhere, is_active: true } });

    const result = await Promise.all(parties.map(async (party) => {
      const [row] = await sequelize.query(`
        SELECT
          COALESCE(SUM(debit_amount),0) - COALESCE(SUM(credit_amount),0) AS balance
        FROM ledger_entries
        WHERE party_id = :pid
      `, { replacements: { pid: party.id }, type: sequelize.QueryTypes.SELECT });

      const balance = Number(row.balance || 0);
      if (overdue_only === 'true' && balance <= 0) return null;
      return { party_id: party.id, name: party.name, party_code: party.party_code, balance };
    }));

    res.json({ success: true, data: result.filter(Boolean) });
  } catch (err) { next(err); }
}

async function createReceipt(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { party_id, type, txn_date, mode, amount, cheque_no, cheque_date, bank_name, utr_no, narration } = req.body;
    const voucherType = type === 'receipt' ? VOUCHER_TYPES.RECEIPT : VOUCHER_TYPES.PAYMENT;
    const voucher_no  = await getNextVoucherNo(voucherType, t);

    const rp = await ReceiptPayment.create({
      voucher_no, party_id, type, txn_date, mode, amount,
      cheque_no, cheque_date, bank_name, utr_no, narration,
    }, { transaction: t });

    await LedgerEntry.create({
      party_id, transaction_date: txn_date,
      voucher_type: type === 'receipt' ? 'Receipt' : 'Payment',
      voucher_no,
      debit_amount:  type === 'payment' ? Number(amount) : 0,
      credit_amount: type === 'receipt' ? Number(amount) : 0,
      narration: narration || `${type} by ${mode}`,
      reference_type: 'receipt_payment', reference_id: rp.id,
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, data: { id: rp.id, voucher_no } });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function createCreditDebitNote(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { party_id, note_type, note_date, related_invoice_id, amount, sgst_amount = 0, cgst_amount = 0, igst_amount = 0, reason } = req.body;
    const voucherType = note_type === 'credit' ? VOUCHER_TYPES.CREDIT_NOTE : VOUCHER_TYPES.DEBIT_NOTE;
    const voucher_no  = await getNextVoucherNo(voucherType, t);

    const note = await CreditDebitNote.create({
      voucher_no, party_id, note_type, note_date, related_invoice_id,
      amount, sgst_amount, cgst_amount, igst_amount, reason,
    }, { transaction: t });

    await LedgerEntry.create({
      party_id, transaction_date: note_date,
      voucher_type: note_type === 'credit' ? 'CreditNote' : 'DebitNote',
      voucher_no,
      debit_amount:  note_type === 'debit' ? Number(amount) : 0,
      credit_amount: note_type === 'credit' ? Number(amount) : 0,
      narration: reason || `${note_type} note`,
      reference_type: 'credit_debit_note', reference_id: note.id,
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, data: { id: note.id, voucher_no } });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

module.exports = { partyLedger, outstanding, createReceipt, createCreditDebitNote };
