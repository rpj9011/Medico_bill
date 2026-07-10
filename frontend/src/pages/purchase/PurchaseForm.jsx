import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { partiesApi } from '../../services/parties.service';
import { productsApi } from '../../services/products.service';
import { calcLine, calcInvoiceTotals, round2 } from '../../utils/gst';
import Button from '../../components/common/Button';
import styles from './PurchaseForm.module.css';

function emptyLine() {
  return { _id: Date.now() + Math.random(), product_id: '', product_name: '', batch_no: '', expiry_date: '', quantity: 1, free_quantity: 0, mrp: 0, purchase_rate: 0, ptr: 0, discount_pct: 0, sgst_pct: 6, cgst_pct: 6, igst_pct: 12, cess_pct: 0, hsn_code: '', grossAmount: 0, discountAmount: 0, taxableAmount: 0, sgstAmount: 0, cgstAmount: 0, igstAmount: 0, cessAmount: 0, lineTotal: 0, _suggestions: [] };
}

export default function PurchaseForm({ initial, onSave, onCancel }) {
  const isView = !!initial?.id;
  const [saving, setSaving] = useState(false);
  const [header, setHeader] = useState({ supplier_id: '', supplier_name: '', bill_no: initial?.bill_no || '', bill_date: initial?.bill_date || new Date().toISOString().slice(0,10), godown_id: 1, lr_no: '', transport: '', narration: '' });
  const [lines, setLines]   = useState([emptyLine()]);
  const [freight, setFreight] = useState(0);
  const [suppSugg, setSuppSugg] = useState([]);

  async function searchSupplier(q) {
    setHeader(h => ({ ...h, supplier_name: q, supplier_id: '' }));
    if (q.length < 2) { setSuppSugg([]); return; }
    const r = await partiesApi.list({ search: q, type: 'supplier', limit: 8 });
    setSuppSugg(r.data.data || []);
  }

  async function onProductSearch(idx, q) {
    updateLine(idx, { product_name: q, product_id: '' });
    if (q.length < 2) return;
    const r = await productsApi.list({ search: q, limit: 8 });
    setLines(prev => prev.map((l, i) => i === idx ? { ...l, _suggestions: r.data.data || [] } : l));
  }

  function selectProduct(idx, p) {
    const updated = { ...lines[idx], product_id: p.id, product_name: p.product_name, hsn_code: p.hsn_code || '', mrp: p.mrp, purchase_rate: p.purchase_rate, ptr: p.ptr, sgst_pct: p.sgst_pct, cgst_pct: p.cgst_pct, igst_pct: p.igst_pct, cess_pct: p.cess_pct, _suggestions: [] };
    const calc = calcLine({ rate: updated.purchase_rate, quantity: updated.quantity, discountPct: updated.discount_pct, sgstPct: updated.sgst_pct, cgstPct: updated.cgst_pct, igstPct: updated.igst_pct, cessPct: updated.cess_pct, isIntraState: true });
    setLines(prev => prev.map((l, i) => i === idx ? { ...updated, ...calc } : l));
  }

  function updateLine(idx, patch) {
    setLines(prev => prev.map((l, i) => {
      if (i !== idx) return l;
      const u = { ...l, ...patch };
      const calc = calcLine({ rate: Number(u.purchase_rate), quantity: Number(u.quantity), discountPct: Number(u.discount_pct), sgstPct: Number(u.sgst_pct), cgstPct: Number(u.cgst_pct), igstPct: Number(u.igst_pct), cessPct: Number(u.cess_pct), isIntraState: true });
      return { ...u, ...calc };
    }));
  }

  const totals = calcInvoiceTotals(lines);
  const net    = round2(totals.netAmount + Number(freight));

  async function handleSave(e) {
    e.preventDefault();
    if (!header.supplier_id) return toast.error('Select a supplier');
    if (!header.bill_no)     return toast.error('Enter supplier bill number');
    setSaving(true);
    try {
      await onSave({ ...header, freight: Number(freight), items: lines.filter(l => l.product_id).map(l => ({ product_id: l.product_id, batch_no: l.batch_no, expiry_date: l.expiry_date, quantity: Number(l.quantity), free_quantity: Number(l.free_quantity), mrp: Number(l.mrp), purchase_rate: Number(l.purchase_rate), ptr: Number(l.ptr), discount_pct: Number(l.discount_pct), hsn_code: l.hsn_code, sgst_pct: l.sgst_pct, cgst_pct: l.cgst_pct, igst_pct: l.igst_pct, cess_pct: l.cess_pct, grossAmount: l.grossAmount, discountAmount: l.discountAmount, taxableAmount: l.taxableAmount, sgstAmount: l.sgstAmount, cgstAmount: l.cgstAmount, igstAmount: l.igstAmount, cessAmount: l.cessAmount, lineTotal: l.lineTotal })) });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  }

  // View mode – show read-only summary
  if (isView) {
    return (
      <div className={styles.viewWrap}>
        <div className={styles.infoGrid}>
          <div><label>Voucher No</label><strong>{initial.voucher_no}</strong></div>
          <div><label>Bill No</label><strong>{initial.bill_no}</strong></div>
          <div><label>Date</label><strong>{fmt_date(initial.bill_date)}</strong></div>
          <div><label>Supplier</label><strong>{initial.Party?.name || initial.supplier?.name}</strong></div>
          <div><label>Net Amount</label><strong style={{color:'var(--color-primary)'}}>₹ {Number(initial.net_amount).toFixed(2)}</strong></div>
          <div><label>Balance</label><strong style={{color: initial.amount_balance > 0 ? '#c0392b':'#27ae60'}}>₹ {Number(initial.amount_balance).toFixed(2)}</strong></div>
        </div>
        {onCancel && <div style={{marginTop:16}}><Button variant="danger" onClick={onCancel}>Cancel Invoice</Button></div>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className={styles.form}>
      <div className={styles.headerGrid}>
        <div className={styles.field}>
          <label>Supplier *</label>
          <div style={{ position: 'relative' }}>
            <input value={header.supplier_name} onChange={e => searchSupplier(e.target.value)} placeholder="Type supplier name…" autoComplete="off" />
            {suppSugg.length > 0 && (
              <ul className={styles.sugg}>
                {suppSugg.map(p => <li key={p.id} onClick={() => { setHeader(h => ({ ...h, supplier_id: p.id, supplier_name: p.name })); setSuppSugg([]); }}>{p.name} <small>{p.party_code}</small></li>)}
              </ul>
            )}
          </div>
        </div>
        <div className={styles.field}><label>Supplier Bill No *</label><input required value={header.bill_no} onChange={e => setHeader(h => ({ ...h, bill_no: e.target.value }))} /></div>
        <div className={styles.field}><label>Bill Date</label><input type="date" value={header.bill_date} onChange={e => setHeader(h => ({ ...h, bill_date: e.target.value }))} /></div>
        <div className={styles.field}><label>Transport</label><input value={header.transport} onChange={e => setHeader(h => ({ ...h, transport: e.target.value }))} /></div>
        <div className={styles.field}><label>LR No</label><input value={header.lr_no} onChange={e => setHeader(h => ({ ...h, lr_no: e.target.value }))} /></div>
        <div className={styles.field}><label>Freight (₹)</label><input type="number" min="0" step="0.01" value={freight} onChange={e => setFreight(e.target.value)} /></div>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
        <table className={styles.tbl}>
          <thead><tr><th>Product</th><th>Batch</th><th>Expiry</th><th>Qty</th><th>Free</th><th>Rate</th><th>MRP</th><th>Disc%</th><th>GST%</th><th>Total</th><th></th></tr></thead>
          <tbody>
            {lines.map((l, idx) => (
              <tr key={l._id}>
                <td style={{ minWidth: 160, position: 'relative' }}>
                  <input value={l.product_name} onChange={e => onProductSearch(idx, e.target.value)} placeholder="Search…" autoComplete="off" />
                  {l._suggestions.length > 0 && (
                    <ul className={styles.sugg} style={{ top: '100%' }}>
                      {l._suggestions.map(p => <li key={p.id} onClick={() => selectProduct(idx, p)}>{p.product_name} <small>{p.pack}</small></li>)}
                    </ul>
                  )}
                </td>
                <td><input value={l.batch_no}     onChange={e => updateLine(idx, { batch_no:     e.target.value })} placeholder="Batch" /></td>
                <td><input type="month" value={l.expiry_date?.slice(0,7) || ''} onChange={e => updateLine(idx, { expiry_date: e.target.value + '-01' })} /></td>
                <td><input type="number" min="0.001" step="0.001" value={l.quantity}      onChange={e => updateLine(idx, { quantity:      e.target.value })} /></td>
                <td><input type="number" min="0"     step="0.001" value={l.free_quantity} onChange={e => updateLine(idx, { free_quantity: e.target.value })} /></td>
                <td><input type="number" min="0"     step="0.01"  value={l.purchase_rate} onChange={e => updateLine(idx, { purchase_rate: e.target.value })} /></td>
                <td><input type="number" min="0"     step="0.01"  value={l.mrp}           onChange={e => updateLine(idx, { mrp:           e.target.value })} /></td>
                <td><input type="number" min="0" max="100" step="0.01" value={l.discount_pct} onChange={e => updateLine(idx, { discount_pct: e.target.value })} /></td>
                <td style={{ textAlign: 'center' }}>{Number(l.igst_pct)}%</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{Number(l.lineTotal).toFixed(2)}</td>
                <td><button type="button" onClick={() => setLines(p => p.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={() => setLines(p => [...p, emptyLine()])} className={styles.addLine}>+ Add Line</button>
      </div>

      <div className={styles.footer}>
        <div className={styles.totalBox}>
          <div className={styles.row}><span>Gross</span>    <span>₹ {totals.gross.toFixed(2)}</span></div>
          <div className={styles.row}><span>Discount</span> <span>₹ {totals.discount.toFixed(2)}</span></div>
          <div className={styles.row}><span>SGST</span>     <span>₹ {totals.sgst.toFixed(2)}</span></div>
          <div className={styles.row}><span>CGST</span>     <span>₹ {totals.cgst.toFixed(2)}</span></div>
          <div className={styles.row}><span>Freight</span>  <span>₹ {Number(freight).toFixed(2)}</span></div>
          <div className={`${styles.row} ${styles.net}`}><span>NET</span><span>₹ {net.toFixed(2)}</span></div>
        </div>
        <Button type="submit" loading={saving} size="lg">Save Purchase</Button>
      </div>
    </form>
  );
}

function fmt_date(d) { return d ? new Date(d).toLocaleDateString('en-IN') : '—'; }
