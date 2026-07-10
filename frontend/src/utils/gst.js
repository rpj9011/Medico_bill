/**
 * Client-side GST calculation (mirrors backend service).
 * Used to show live totals while building a bill before submission.
 */

export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function calcLine({ rate, quantity, discountPct = 0, sgstPct = 0, cgstPct = 0, igstPct = 0, cessPct = 0, isIntraState = true }) {
  const grossAmount    = round2(rate * quantity);
  const discountAmount = round2(grossAmount * discountPct / 100);
  const taxableAmount  = round2(grossAmount - discountAmount);

  const sgstAmount = isIntraState ? round2(taxableAmount * sgstPct / 100) : 0;
  const cgstAmount = isIntraState ? round2(taxableAmount * cgstPct / 100) : 0;
  const igstAmount = !isIntraState ? round2(taxableAmount * igstPct / 100) : 0;
  const cessAmount = round2(taxableAmount * cessPct / 100);

  const lineTotal = round2(taxableAmount + sgstAmount + cgstAmount + igstAmount + cessAmount);
  return { grossAmount, discountAmount, taxableAmount, sgstAmount, cgstAmount, igstAmount, cessAmount, lineTotal };
}

export function calcInvoiceTotals(lines) {
  const totals = lines.reduce((acc, l) => {
    acc.gross    += Number(l.grossAmount || 0);
    acc.discount += Number(l.discountAmount || 0);
    acc.sgst     += Number(l.sgstAmount || 0);
    acc.cgst     += Number(l.cgstAmount || 0);
    acc.igst     += Number(l.igstAmount || 0);
    acc.cess     += Number(l.cessAmount || 0);
    acc.sub      += Number(l.lineTotal || 0);
    return acc;
  }, { gross: 0, discount: 0, sgst: 0, cgst: 0, igst: 0, cess: 0, sub: 0 });

  const roundOff = round2(Math.round(totals.sub) - totals.sub);
  totals.netAmount = round2(totals.sub + roundOff);
  totals.roundOff  = roundOff;
  return totals;
}
