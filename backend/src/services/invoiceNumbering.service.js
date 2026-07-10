'use strict';
/**
 * Voucher numbering service.
 * Each voucher type has its own running sequence stored in `voucher_sequences`.
 * Numbers are never derived by counting rows — always incremented here.
 */
const { VoucherSequence } = require('../models');
const sequelize = require('../config/database');

const VOUCHER_TYPES = {
  SALES_CREDIT:   'SC',
  SALES_CASH:     'SA',
  SALES_COUNTER:  'CN',
  PURCHASE:       'PU',
  CREDIT_NOTE:    'CR',
  DEBIT_NOTE:     'DR',
  RECEIPT:        'RC',
  PAYMENT:        'PY',
  QUOTATION:      'QT',
  CHALLAN:        'CH',
};

/**
 * Returns the next formatted voucher number for the given type.
 * Uses a SELECT ... FOR UPDATE inside a transaction to prevent race conditions.
 *
 * @param {string} type  - one of the VOUCHER_TYPES values or a custom string
 * @param {object} [t]   - optional existing Sequelize transaction
 */
async function getNextVoucherNo(type, t) {
  const transaction = t || (await sequelize.transaction());
  const ownTxn = !t;

  try {
    const seq = await VoucherSequence.findOne({
      where: { voucher_type: type },
      lock: true,
      transaction,
    });

    if (!seq) {
      throw new Error(`Voucher sequence not found for type: ${type}`);
    }

    const nextNo = seq.current_no + 1;
    await seq.update({ current_no: nextNo }, { transaction });

    const formatted = `${seq.prefix}${String(nextNo).padStart(6, '0')}${seq.suffix}`;
    if (ownTxn) await transaction.commit();
    return formatted;
  } catch (err) {
    if (ownTxn) await transaction.rollback();
    throw err;
  }
}

module.exports = { getNextVoucherNo, VOUCHER_TYPES };
