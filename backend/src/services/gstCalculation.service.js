'use strict';
/**
 * GST calculation helpers.
 *
 * Rules:
 *  - If buyer state_code === business state_code → SGST + CGST (each = gst_rate / 2)
 *  - Else → IGST (= full gst_rate)
 *  - GST is always calculated on (taxable_amount) = (rate × qty) − trade_discount
 */

const BUSINESS_STATE_CODE = process.env.BUSINESS_STATE_CODE || '27';

/**
 * Determine whether a party is in the same state as the business.
 */
function isIntraState(partyStateCode) {
  return String(partyStateCode) === String(BUSINESS_STATE_CODE);
}

/**
 * Calculate line-level GST amounts.
 *
 * @param {object} params
 * @param {number} params.rate           - per-unit sale/purchase rate (after trade discount, before GST)
 * @param {number} params.quantity       - billed quantity (free qty excluded from taxable)
 * @param {number} params.discountPct    - trade discount %
 * @param {number} params.sgstPct        - SGST % from product master
 * @param {number} params.cgstPct        - CGST % from product master
 * @param {number} params.igstPct        - IGST % from product master
 * @param {number} params.cessPct        - CESS %
 * @param {string} params.partyStateCode - buyer's state GST code
 *
 * @returns {object} { grossAmount, discountAmount, taxableAmount, sgstAmount, cgstAmount, igstAmount, cessAmount, lineTotal }
 */
function calculateLineGST({
  rate, quantity, discountPct = 0,
  sgstPct = 0, cgstPct = 0, igstPct = 0, cessPct = 0,
  partyStateCode,
}) {
  const grossAmount   = round2(rate * quantity);
  const discountAmount = round2(grossAmount * discountPct / 100);
  const taxableAmount  = round2(grossAmount - discountAmount);

  let sgstAmount = 0, cgstAmount = 0, igstAmount = 0, cessAmount = 0;

  if (isIntraState(partyStateCode)) {
    sgstAmount = round2(taxableAmount * sgstPct / 100);
    cgstAmount = round2(taxableAmount * cgstPct / 100);
  } else {
    igstAmount = round2(taxableAmount * igstPct / 100);
  }
  cessAmount = round2(taxableAmount * cessPct / 100);

  const lineTotal = round2(taxableAmount + sgstAmount + cgstAmount + igstAmount + cessAmount);

  return { grossAmount, discountAmount, taxableAmount, sgstAmount, cgstAmount, igstAmount, cessAmount, lineTotal };
}

/**
 * Aggregate line-level amounts into invoice-level totals.
 */
function aggregateInvoiceTotals(lines) {
  const totals = lines.reduce((acc, l) => {
    acc.grossAmount           += Number(l.grossAmount || 0);
    acc.discountAmount        += Number(l.discountAmount || 0);
    acc.taxableAmount         += Number(l.taxableAmount || 0);
    acc.sgstAmount            += Number(l.sgstAmount || 0);
    acc.cgstAmount            += Number(l.cgstAmount || 0);
    acc.igstAmount            += Number(l.igstAmount || 0);
    acc.cessAmount            += Number(l.cessAmount || 0);
    acc.lineTotal             += Number(l.lineTotal || 0);
    return acc;
  }, { grossAmount: 0, discountAmount: 0, taxableAmount: 0, sgstAmount: 0, cgstAmount: 0, igstAmount: 0, cessAmount: 0, lineTotal: 0 });

  // round_off: difference to make net_amount an integer
  const rawNet  = totals.lineTotal;
  const roundedNet = Math.round(rawNet);
  totals.roundOff = round2(roundedNet - rawNet);
  totals.netAmount = round2(rawNet + totals.roundOff);

  return totals;
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

module.exports = { calculateLineGST, aggregateInvoiceTotals, isIntraState, round2 };
