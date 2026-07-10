import React, { useState } from 'react';
import Button from '../../components/common/Button';
import styles from '../parties/PartyForm.module.css'; // reuse same form styles

const INIT = {
  product_code: '', product_name: '', pack: '', uom: 'NOS',
  hsn_code: '', mrp: 0, purchase_rate: 0, sale_rate: 0, ptr: 0,
  sgst_pct: 0, cgst_pct: 0, igst_pct: 0, cess_pct: 0,
  min_level: 0, max_level: 0,
  is_dpco_controlled: false, dpco_price_ceiling: 0,
  is_schedule_drug: false, barcode: '', rack_location: '',
};

export default function ProductForm({ initial, onSave, saving }) {
  const [form, setForm] = useState({ ...INIT, ...(initial || {}) });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handleGstChange(v) {
    const half = (Number(v) / 2).toFixed(2);
    setForm(f => ({ ...f, igst_pct: v, sgst_pct: half, cgst_pct: half }));
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className={styles.form}>
      <div className={styles.grid2}>
        <div className={styles.field}><label>Product Code *</label><input required value={form.product_code} onChange={e => set('product_code', e.target.value)} /></div>
        <div className={styles.field}><label>Pack</label><input value={form.pack} onChange={e => set('pack', e.target.value)} placeholder="10x10, 30ml…" /></div>
      </div>
      <div className={styles.field}><label>Product Name *</label><input required value={form.product_name} onChange={e => set('product_name', e.target.value)} /></div>
      <div className={styles.grid3}>
        <div className={styles.field}><label>HSN Code</label><input value={form.hsn_code} onChange={e => set('hsn_code', e.target.value)} /></div>
        <div className={styles.field}><label>UOM</label><input value={form.uom} onChange={e => set('uom', e.target.value)} /></div>
        <div className={styles.field}><label>Barcode</label><input value={form.barcode} onChange={e => set('barcode', e.target.value)} /></div>
      </div>
      <div className={styles.grid3}>
        <div className={styles.field}><label>MRP (₹)</label><input type="number" min="0" step="0.01" value={form.mrp} onChange={e => set('mrp', e.target.value)} /></div>
        <div className={styles.field}><label>Purchase Rate (₹)</label><input type="number" min="0" step="0.01" value={form.purchase_rate} onChange={e => set('purchase_rate', e.target.value)} /></div>
        <div className={styles.field}><label>Sale Rate (₹)</label><input type="number" min="0" step="0.01" value={form.sale_rate} onChange={e => set('sale_rate', e.target.value)} /></div>
      </div>
      <div className={styles.grid3}>
        <div className={styles.field}>
          <label>GST Slab %</label>
          <select value={form.igst_pct} onChange={e => handleGstChange(e.target.value)}>
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>
        <div className={styles.field}><label>SGST%</label><input type="number" value={form.sgst_pct} onChange={e => set('sgst_pct', e.target.value)} /></div>
        <div className={styles.field}><label>CGST%</label><input type="number" value={form.cgst_pct} onChange={e => set('cgst_pct', e.target.value)} /></div>
      </div>
      <div className={styles.grid3}>
        <div className={styles.field}><label>Min Stock</label><input type="number" min="0" value={form.min_level} onChange={e => set('min_level', e.target.value)} /></div>
        <div className={styles.field}><label>Max Stock</label><input type="number" min="0" value={form.max_level} onChange={e => set('max_level', e.target.value)} /></div>
        <div className={styles.field}><label>Rack Location</label><input value={form.rack_location} onChange={e => set('rack_location', e.target.value)} /></div>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
          <input type="checkbox" checked={form.is_dpco_controlled} onChange={e => set('is_dpco_controlled', e.target.checked)} />
          DPCO Controlled Drug
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
          <input type="checkbox" checked={form.is_schedule_drug} onChange={e => set('is_schedule_drug', e.target.checked)} />
          Schedule Drug (H/X)
        </label>
      </div>
      {form.is_dpco_controlled && (
        <div className={styles.field}>
          <label>DPCO Price Ceiling (₹)</label>
          <input type="number" min="0" step="0.01" value={form.dpco_price_ceiling} onChange={e => set('dpco_price_ceiling', e.target.value)} />
        </div>
      )}
      <div className={styles.actions}><Button type="submit" loading={saving}>Save Product</Button></div>
    </form>
  );
}
