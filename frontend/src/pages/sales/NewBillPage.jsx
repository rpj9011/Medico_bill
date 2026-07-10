import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { salesApi } from '../../services/sales.service';
import { partiesApi } from '../../services/parties.service';
import api from '../../services/api';
import { calcLine, calcInvoiceTotals, round2 } from '../../utils/gst';
import Button from '../../components/common/Button';
import styles from './NewBillPage.module.css';

// Search products that have available stock — returns each product with its batches array
const stockApi = {
  searchProducts: (params) => api.get('/stock/search', { params }),
};

function emptyLine() {
  return {
    _id: Date.now() + Math.random(),
    product_id: '', product_name: '', batch_no: '', expiry_date: '',
    quantity: 1, free_quantity: 0, mrp: 0, rate: 0, ptr: 0,
    discount_pct: 0, sgst_pct: 0, cgst_pct: 0, igst_pct: 0, cess_pct: 0,
    hsn_code: '',
    grossAmount: 0, discountAmount: 0, taxableAmount: 0,
    sgstAmount: 0, cgstAmount: 0, igstAmount: 0, cessAmount: 0, lineTotal: 0,
    batches: [], is_dpco: false,
    _productSuggestions: [],
  };
}

/**
 * Dropdown rendered in a portal fixed to the viewport so it is never
 * clipped by overflow:auto / overflow:hidden ancestors.
 */
function FixedDropdown({ anchorRef, children, onClose }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setRect(r);
  }, [anchorRef]);

  // Close when clicking outside
  useEffect(() => {
    function handle(e) {
      if (anchorRef.current && !anchorRef.current.closest('[data-dropdown-anchor]')?.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [anchorRef, onClose]);

  if (!rect) return null;

  return (
    <ul
      style={{
        position:  'fixed',
        top:       rect.bottom + 2,
        left:      rect.left,
        width:     Math.max(rect.width, 380),
        zIndex:    9999,
        background: '#fff',
        border:    '1px solid #d0d7de',
        borderRadius: 6,
        boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
        maxHeight: 320,
        overflowY: 'auto',
        listStyle: 'none',
        padding:   0,
        margin:    0,
      }}
    >
      {children}
    </ul>
  );
}

export default function NewBillPage() {
  const navigate = useNavigate();
  const [saving,  setSaving]  = useState(false);
  const [header,  setHeader]  = useState({
    customer_id: '', customer_name: '', voucher_type: 'credit',
    invoice_date: new Date().toISOString().slice(0, 10),
    salesman_id: '', godown_id: 1, narration: '',
  });
  const [lines,    setLines]    = useState([emptyLine()]);
  const [cashDisc, setCashDisc] = useState(0);
  const [freight,  setFreight]  = useState(0);
  const [amtRcvd,  setAmtRcvd]  = useState(0);
  const [partySearch,       setPartySearch]       = useState('');
  const [partySuggestions,  setPartySuggestions]  = useState([]);
  const isIntraState = true;
  // one ref per line to anchor the fixed dropdown
  const inputRefs = useRef({});

  // ── Party search ─────────────────────────────────────────────────────────
  async function searchParty(q) {
    setPartySearch(q);
    // Clear customer_id whenever the text changes so stale id doesn't persist
    setHeader(h => ({ ...h, customer_id: '', customer_name: '' }));
    if (q.length < 2) { setPartySuggestions([]); return; }
    const res = await partiesApi.list({ search: q, type: 'customer', limit: 10 });
    setPartySuggestions(res.data.data || []);
  }

  function selectParty(p) {
    setHeader(h => ({ ...h, customer_id: p.id, customer_name: p.name }));
    setPartySearch(p.name);
    setPartySuggestions([]);
  }

  // Auto-select on blur for credit/cash bills (must select existing party)
  function onPartyBlur() {
    if (header.voucher_type === 'counter') return; // counter allows free text
    if (header.customer_id) return;
    if (partySuggestions.length === 0) return;

    const q = partySearch.trim().toLowerCase();
    const exact = partySuggestions.find(p => p.name.toLowerCase() === q);
    if (exact) {
      selectParty(exact);
    } else if (partySuggestions.length === 1) {
      selectParty(partySuggestions[0]);
    }
  }

  // For counter bills: resolve an existing party or create a walk-in customer
  async function resolveCounterCustomer() {
    const name = partySearch.trim();
    if (!name) return null;

    // Already resolved via dropdown click
    if (header.customer_id) return header.customer_id;

    // Look for exact name match in DB
    const res = await partiesApi.list({ search: name, type: 'customer', limit: 20 });
    const parties = res.data.data || [];
    const exact = parties.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (exact) {
      setHeader(h => ({ ...h, customer_id: exact.id, customer_name: exact.name }));
      return exact.id;
    }

    // Create new walk-in customer on the fly
    const code = 'CTR-' + Date.now().toString().slice(-8);
    const created = await partiesApi.create({
      name,
      party_code: code,
      party_type: 'customer',
      is_active:  true,
    });
    const newParty = created.data.data;
    setHeader(h => ({ ...h, customer_id: newParty.id, customer_name: newParty.name }));
    return newParty.id;
  }

  // ── Product search — from stock, not product master ───────────────────────
  async function onProductSearch(lineIdx, q) {
    setLines(prev => prev.map((l, i) =>
      i === lineIdx ? { ...l, product_name: q, product_id: '', _productSuggestions: [] } : l
    ));
    if (q.length < 2) return;
    try {
      const res = await stockApi.searchProducts({
        search: q,
        godown_id: header.godown_id || undefined,
        limit: 10,
      });
      setLines(prev => prev.map((l, i) =>
        i === lineIdx ? { ...l, _productSuggestions: res.data.data || [] } : l
      ));
    } catch {
      // silently ignore search errors
    }
  }

  // ── Select product — batches already embedded in the result ───────────────
  function selectProduct(lineIdx, product) {
    const batches    = product.batches || [];
    const firstBatch = batches[0] || {};

    const newLine = {
      ...lines[lineIdx],
      product_id:   product.id,
      product_name: product.product_name,
      hsn_code:     product.hsn_code || '',
      mrp:          Number(firstBatch.mrp       ?? product.mrp       ?? 0),
      rate:         Number(firstBatch.sale_rate  ?? product.sale_rate ?? 0),
      ptr:          Number(firstBatch.ptr        ?? product.ptr       ?? 0),
      batch_no:     firstBatch.batch_no    || '',
      expiry_date:  firstBatch.expiry_date || '',
      sgst_pct:     Number(product.sgst_pct || 0),
      cgst_pct:     Number(product.cgst_pct || 0),
      igst_pct:     Number(product.igst_pct || 0),
      cess_pct:     Number(product.cess_pct || 0),
      is_dpco:      product.is_dpco_controlled,
      batches,
      _productSuggestions: [],
    };
    const calc = calcLine({ ...newLine, isIntraState });
    setLines(prev => prev.map((l, i) => i === lineIdx ? { ...newLine, ...calc } : l));
  }

  // ── Batch change — auto-fill mrp / rate / expiry from batch ───────────────
  function onBatchChange(lineIdx, batchNo) {
    setLines(prev => prev.map((l, i) => {
      if (i !== lineIdx) return l;
      const b = l.batches.find(x => x.batch_no === batchNo);
      const updated = {
        ...l,
        batch_no:    batchNo,
        expiry_date: b?.expiry_date || '',
        mrp:         b ? Number(b.mrp)      : l.mrp,
        rate:        b ? Number(b.sale_rate) : l.rate,
        ptr:         b ? Number(b.ptr)       : l.ptr,
      };
      const calc = calcLine({
        rate: updated.rate, quantity: Number(updated.quantity),
        discountPct: Number(updated.discount_pct),
        sgstPct: Number(updated.sgst_pct), cgstPct: Number(updated.cgst_pct),
        igstPct: Number(updated.igst_pct), cessPct: Number(updated.cess_pct),
        isIntraState,
      });
      return { ...updated, ...calc };
    }));
  }

  // ── Generic line field update ─────────────────────────────────────────────
  function updateLine(lineIdx, patch) {
    setLines(prev => prev.map((l, i) => {
      if (i !== lineIdx) return l;
      const updated = { ...l, ...patch };
      const calc = calcLine({
        rate:        Number(updated.rate),
        quantity:    Number(updated.quantity),
        discountPct: Number(updated.discount_pct),
        sgstPct:     Number(updated.sgst_pct),
        cgstPct:     Number(updated.cgst_pct),
        igstPct:     Number(updated.igst_pct),
        cessPct:     Number(updated.cess_pct),
        isIntraState,
      });
      return { ...updated, ...calc };
    }));
  }

  function addLine()       { setLines(prev => [...prev, emptyLine()]); }
  function removeLine(idx) { setLines(prev => prev.filter((_, i) => i !== idx)); }

  const totals           = calcInvoiceTotals(lines);
  const netAfterCashDisc = round2(totals.netAmount - Number(cashDisc) + Number(freight));
  const balance          = round2(netAfterCashDisc - Number(amtRcvd));

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();

    // Validate lines first before any async work
    if (lines.every(l => !l.product_id)) return toast.error('Add at least one product');
    if (lines.some(l => l.product_id && !l.batch_no)) return toast.error('Select a batch for all products');

    setSaving(true);

    let resolvedCustomerId = header.customer_id;

    if (header.voucher_type === 'counter') {
      if (!partySearch.trim()) {
        setSaving(false);
        return toast.error('Enter a customer name');
      }
      try {
        resolvedCustomerId = await resolveCounterCustomer();
      } catch (err) {
        setSaving(false);
        return toast.error(err.response?.data?.message || 'Could not resolve customer');
      }
    } else {
      if (!header.customer_id) {
        setSaving(false);
        return toast.error('Please select a customer from the dropdown');
      }
    }

    try {
      const payload = {
        ...header,
        customer_id: resolvedCustomerId,
        items: lines.filter(l => l.product_id).map(l => ({
          product_id:    l.product_id,
          batch_no:      l.batch_no,
          expiry_date:   l.expiry_date,
          quantity:      Number(l.quantity),
          free_quantity: Number(l.free_quantity),
          mrp:           Number(l.mrp),
          rate:          Number(l.rate),
          ptr:           Number(l.ptr),
          discount_pct:  Number(l.discount_pct),
          hsn_code:      l.hsn_code,
          sgst_pct: l.sgst_pct, cgst_pct: l.cgst_pct,
          igst_pct: l.igst_pct, cess_pct: l.cess_pct,
          grossAmount:    l.grossAmount,    discountAmount: l.discountAmount,
          taxableAmount:  l.taxableAmount,  sgstAmount:     l.sgstAmount,
          cgstAmount:     l.cgstAmount,     igstAmount:     l.igstAmount,
          cessAmount:     l.cessAmount,     lineTotal:      l.lineTotal,
        })),
        freight:              Number(freight),
        cash_discount_amount: Number(cashDisc),
        amount_received:      Number(amtRcvd),
      };

      const res = await salesApi.create(payload);
      toast.success(`Bill saved: ${res.data.data.voucher_no}`);
      navigate('/sales');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSave} className={styles.page}>
      <div className={styles.topBar}>
        <h2>New Bill</h2>
        <div className={styles.topActions}>
          <Button type="button" variant="outline" onClick={() => navigate('/sales')}>Cancel</Button>
          <Button type="submit" loading={saving}>Save Bill</Button>
        </div>
      </div>

      {/* ── Header ── */}
      <div className={styles.headerGrid}>
        <div className={styles.field}>
          <label>
            {header.voucher_type === 'counter' ? 'Customer (Walk-in) *' : 'Customer *'}
          </label>
          <div className={styles.autocomplete}>
            <input
              value={partySearch}
              onChange={e => searchParty(e.target.value)}
              onBlur={onPartyBlur}
              placeholder={
                header.voucher_type === 'counter'
                  ? 'Type name — existing or new walk-in…'
                  : 'Type customer name / code…'
              }
              autoComplete="off"
              required={header.voucher_type !== 'counter' && !header.customer_id}
            />
            {/* Show match status hint for counter bills */}
            {header.voucher_type === 'counter' && partySearch.trim().length > 1 && (
              <small style={{ display: 'block', marginTop: 3, fontSize: 11,
                color: header.customer_id ? '#27ae60' : '#e67e22' }}>
                {header.customer_id
                  ? `✓ Existing customer selected`
                  : partySuggestions.length > 0
                    ? `${partySuggestions.length} match(es) found — select or type new name`
                    : `No match — will create new walk-in customer on save`}
              </small>
            )}
            {partySuggestions.length > 0 && (
              <ul className={styles.suggestions}>
                {partySuggestions.map(p => (
                  <li key={p.id} onClick={() => selectParty(p)}>
                    <strong>{p.name}</strong>{' '}
                    <small>{p.party_code} · {p.gst_number || 'No GST'}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={styles.field}>
          <label>Bill Type</label>
          <select value={header.voucher_type} onChange={e => {
            const vt = e.target.value;
            // Reset customer when switching bill types to avoid stale state
            setHeader(h => ({ ...h, voucher_type: vt, customer_id: '', customer_name: '' }));
            setPartySearch('');
            setPartySuggestions([]);
          }}>
            <option value="credit">Credit</option>
            <option value="cash">Cash</option>
            <option value="counter">Counter</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Date</label>
          <input type="date" value={header.invoice_date}
            onChange={e => setHeader(h => ({ ...h, invoice_date: e.target.value }))} required />
        </div>
        <div className={styles.field}>
          <label>Narration</label>
          <input value={header.narration}
            onChange={e => setHeader(h => ({ ...h, narration: e.target.value }))}
            placeholder="Optional note" />
        </div>
      </div>

      {/* ── Line Items ── */}
      <div className={styles.linesWrapper}>
        <table className={styles.lineTable}>
          <thead>
            <tr>
              <th style={{ width: 200 }}>Product</th>
              <th style={{ width: 120 }}>Batch</th>
              <th style={{ width: 80  }}>Expiry</th>
              <th style={{ width: 55  }}>Stock</th>
              <th style={{ width: 60  }}>Qty</th>
              <th style={{ width: 50  }}>Free</th>
              <th style={{ width: 70  }}>MRP</th>
              <th style={{ width: 70  }}>Rate</th>
              <th style={{ width: 55  }}>Disc%</th>
              <th style={{ width: 70  }}>Taxable</th>
              <th style={{ width: 70  }}>GST</th>
              <th style={{ width: 80  }}>Total</th>
              <th style={{ width: 32  }}></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, idx) => {
              const selBatch    = line.batches.find(b => b.batch_no === line.batch_no);
              const stockOnHand = selBatch ? Number(selBatch.quantity_on_hand) : null;
              const isLow       = stockOnHand !== null && stockOnHand < Number(line.quantity);

              return (
                <tr key={line._id}>
                  {/* Product autocomplete */}
                  <td className={styles.productCell} data-dropdown-anchor="true">
                    <input
                      ref={el => { inputRefs.current[line._id] = el; }}
                      value={line.product_name}
                      onChange={e => onProductSearch(idx, e.target.value)}
                      placeholder="Search in stock…"
                      autoComplete="off"
                    />
                    {line._productSuggestions?.length > 0 && (
                      <FixedDropdown
                        anchorRef={{ current: inputRefs.current[line._id] }}
                        onClose={() => setLines(prev => prev.map((l, i) =>
                          i === idx ? { ...l, _productSuggestions: [] } : l
                        ))}
                      >
                        {line._productSuggestions.map(p => (
                          <li
                            key={p.id}
                            onMouseDown={() => selectProduct(idx, p)}
                            style={{
                              padding: '8px 12px',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f0f4f8',
                              fontSize: 13,
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0f8ff'}
                            onMouseLeave={e => e.currentTarget.style.background = ''}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>
                                <strong>{p.product_name}</strong>
                                {p.pack && <small style={{ marginLeft: 6, color: '#888' }}>{p.pack}</small>}
                                {p.is_dpco_controlled && <span className={styles.dpcoBadge}>DPCO</span>}
                              </span>
                              <small style={{ color: '#27ae60', marginLeft: 8 }}>
                                {p.batches.length} batch{p.batches.length !== 1 ? 'es' : ''}
                              </small>
                            </div>
                            {p.batches.slice(0, 3).map(b => (
                              <div key={b.batch_no} style={{ fontSize: 11, color: '#555', paddingLeft: 4, marginTop: 3 }}>
                                <span style={{ fontWeight: 600 }}>#{b.batch_no}</span>
                                {' · '}Exp: {b.expiry_date ? b.expiry_date.slice(0, 7) : '—'}
                                {' · '}MRP: ₹{Number(b.mrp).toFixed(2)}
                                {' · '}Rate: ₹{Number(b.sale_rate).toFixed(2)}
                                {' · '}
                                <span style={{ color: Number(b.quantity_on_hand) > 0 ? '#27ae60' : '#e74c3c' }}>
                                  Qty: {Number(b.quantity_on_hand).toFixed(0)}
                                </span>
                              </div>
                            ))}
                          </li>
                        ))}
                      </FixedDropdown>
                    )}
                  </td>

                  {/* Batch selector */}
                  <td>
                    {line.batches.length > 0 ? (
                      <select value={line.batch_no} onChange={e => onBatchChange(idx, e.target.value)}
                        style={{ width: '100%' }}>
                        {line.batches.map(b => (
                          <option key={b.batch_no} value={b.batch_no}>
                            {b.batch_no} (Qty: {Number(b.quantity_on_hand).toFixed(0)})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input value={line.batch_no}
                        onChange={e => updateLine(idx, { batch_no: e.target.value })}
                        placeholder="Batch…" style={{ width: '100%' }} />
                    )}
                  </td>

                  {/* Expiry — auto-filled from batch */}
                  <td>
                    <input type="month"
                      value={line.expiry_date ? line.expiry_date.slice(0, 7) : ''}
                      readOnly className={styles.readOnly} />
                  </td>

                  {/* Stock on hand */}
                  <td className={styles.num}
                    style={{ color: isLow ? '#e74c3c' : '#27ae60', fontWeight: 600 }}>
                    {stockOnHand !== null ? stockOnHand.toFixed(0) : '—'}
                  </td>

                  <td>
                    <input type="number" min="0.001" step="0.001" value={line.quantity}
                      onChange={e => updateLine(idx, { quantity: e.target.value })}
                      style={{ border: isLow ? '1px solid #e74c3c' : undefined }} />
                  </td>
                  <td><input type="number" min="0" step="0.001" value={line.free_quantity}
                    onChange={e => updateLine(idx, { free_quantity: e.target.value })} /></td>
                  <td><input type="number" min="0" step="0.01" value={line.mrp}
                    onChange={e => updateLine(idx, { mrp: e.target.value })} /></td>
                  <td><input type="number" min="0" step="0.01" value={line.rate}
                    onChange={e => updateLine(idx, { rate: e.target.value })} /></td>
                  <td>
                    <input type="number" min="0" max="100" step="0.01"
                      value={line.discount_pct}
                      onChange={e => updateLine(idx, { discount_pct: e.target.value })}
                      className={line.is_dpco ? styles.dpcoInput : ''}
                      title={line.is_dpco ? 'DPCO: verify max discount ceiling' : ''} />
                  </td>
                  <td className={styles.num}>{Number(line.taxableAmount).toFixed(2)}</td>
                  <td className={styles.num}>
                    {Number((line.sgstAmount || 0) + (line.cgstAmount || 0) + (line.igstAmount || 0)).toFixed(2)}
                  </td>
                  <td className={`${styles.num} ${styles.bold}`}>{Number(line.lineTotal).toFixed(2)}</td>
                  <td>
                    <button type="button" className={styles.removeBtn}
                      onClick={() => removeLine(idx)} title="Remove line">✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button type="button" className={styles.addLine} onClick={addLine}>+ Add Line</button>
      </div>

      {/* ── Totals ── */}
      <div className={styles.totalsArea}>
        <div className={styles.chargesGrid}>
          <label>Cash Discount <input type="number" min="0" step="0.01" value={cashDisc} onChange={e => setCashDisc(e.target.value)} /></label>
          <label>Freight       <input type="number" min="0" step="0.01" value={freight}  onChange={e => setFreight(e.target.value)} /></label>
          <label>Amount Recd.  <input type="number" min="0" step="0.01" value={amtRcvd}  onChange={e => setAmtRcvd(e.target.value)} /></label>
        </div>
        <div className={styles.totalBox}>
          <div className={styles.totalRow}><span>Gross</span>    <span>₹ {totals.gross.toFixed(2)}</span></div>
          <div className={styles.totalRow}><span>Discount</span> <span>₹ {totals.discount.toFixed(2)}</span></div>
          <div className={styles.totalRow}><span>SGST</span>     <span>₹ {totals.sgst.toFixed(2)}</span></div>
          <div className={styles.totalRow}><span>CGST</span>     <span>₹ {totals.cgst.toFixed(2)}</span></div>
          {totals.igst > 0 && (
            <div className={styles.totalRow}><span>IGST</span>   <span>₹ {totals.igst.toFixed(2)}</span></div>
          )}
          <div className={styles.totalRow}><span>Cash Disc.</span> <span>- ₹ {Number(cashDisc).toFixed(2)}</span></div>
          <div className={styles.totalRow}><span>Freight</span>    <span>+ ₹ {Number(freight).toFixed(2)}</span></div>
          <div className={`${styles.totalRow} ${styles.netRow}`}>
            <span>NET AMOUNT</span><span>₹ {netAfterCashDisc.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}><span>Received</span>   <span>₹ {Number(amtRcvd).toFixed(2)}</span></div>
          <div className={`${styles.totalRow} ${balance > 0 ? styles.balanceDue : styles.balancePaid}`}>
            <span>Balance</span><span>₹ {balance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </form>
  );
}
