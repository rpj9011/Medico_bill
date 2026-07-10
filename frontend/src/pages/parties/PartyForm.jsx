import React, { useState } from 'react';
import Button from '../../components/common/Button';
import styles from './PartyForm.module.css';

const INITIAL = {
  party_code: '', name: '', party_type: 'customer',
  address1: '', city: '', state: '', state_code: '', pincode: '',
  phone: '', mobile: '', email: '',
  gst_number: '', drug_license_no: '', pan_no: '',
  credit_limit: 0, credit_days: 0, discount_pct: 0,
  opening_debit: 0, opening_credit: 0,
};

export default function PartyForm({ initial, onSave, saving }) {
  const [form, setForm] = useState({ ...INITIAL, ...(initial || {}) });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid2}>
        <div className={styles.field}><label>Party Code *</label><input required value={form.party_code} onChange={e => set('party_code', e.target.value)} /></div>
        <div className={styles.field}><label>Type</label>
          <select value={form.party_type} onChange={e => set('party_type', e.target.value)}>
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>
      <div className={styles.field}><label>Full Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} /></div>
      <div className={styles.grid2}>
        <div className={styles.field}><label>Address</label><input value={form.address1} onChange={e => set('address1', e.target.value)} /></div>
        <div className={styles.field}><label>City</label><input value={form.city} onChange={e => set('city', e.target.value)} /></div>
      </div>
      <div className={styles.grid3}>
        <div className={styles.field}><label>State</label><input value={form.state} onChange={e => set('state', e.target.value)} /></div>
        <div className={styles.field}><label>State Code</label><input value={form.state_code} onChange={e => set('state_code', e.target.value)} placeholder="e.g. 27" /></div>
        <div className={styles.field}><label>Pincode</label><input value={form.pincode} onChange={e => set('pincode', e.target.value)} /></div>
      </div>
      <div className={styles.grid2}>
        <div className={styles.field}><label>Phone</label><input value={form.phone}  onChange={e => set('phone', e.target.value)} /></div>
        <div className={styles.field}><label>Mobile</label><input value={form.mobile} onChange={e => set('mobile', e.target.value)} /></div>
      </div>
      <div className={styles.grid2}>
        <div className={styles.field}><label>GSTIN</label><input value={form.gst_number} onChange={e => set('gst_number', e.target.value.toUpperCase())} placeholder="15-char GST number" maxLength={15} /></div>
        <div className={styles.field}><label>Drug License No.</label><input value={form.drug_license_no} onChange={e => set('drug_license_no', e.target.value)} /></div>
      </div>
      <div className={styles.grid3}>
        <div className={styles.field}><label>Credit Limit (₹)</label><input type="number" min="0" value={form.credit_limit} onChange={e => set('credit_limit', e.target.value)} /></div>
        <div className={styles.field}><label>Credit Days</label><input type="number" min="0" value={form.credit_days} onChange={e => set('credit_days', e.target.value)} /></div>
        <div className={styles.field}><label>Discount %</label><input type="number" min="0" max="100" step="0.01" value={form.discount_pct} onChange={e => set('discount_pct', e.target.value)} /></div>
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={saving}>Save Party</Button>
      </div>
    </form>
  );
}
