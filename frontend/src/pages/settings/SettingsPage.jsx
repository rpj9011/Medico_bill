import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const settingsApi = {
  get:    ()  => api.get('/settings'),
  update: (d) => api.put('/settings', d),
};

const SECTIONS = [
  {
    title: 'Company Info',
    fields: [
      { key: 'company_name',    label: 'Company Name',    type: 'text' },
      { key: 'address',         label: 'Address',         type: 'text' },
      { key: 'city',            label: 'City',            type: 'text' },
      { key: 'state',           label: 'State',           type: 'text' },
      { key: 'pincode',         label: 'Pincode',         type: 'text' },
      { key: 'phone',           label: 'Phone',           type: 'text' },
      { key: 'email',           label: 'Email',           type: 'email' },
      { key: 'gstin',           label: 'GSTIN',           type: 'text' },
      { key: 'drug_license_no', label: 'Drug License No', type: 'text' },
    ],
  },
  {
    title: 'Invoice Settings',
    fields: [
      { key: 'invoice_prefix',       label: 'Invoice Prefix',       type: 'text' },
      { key: 'purchase_prefix',      label: 'Purchase Prefix',      type: 'text' },
      { key: 'quotation_prefix',     label: 'Quotation Prefix',     type: 'text' },
      { key: 'challan_prefix',       label: 'Challan Prefix',       type: 'text' },
      { key: 'financial_year_start', label: 'Financial Year Start', type: 'date' },
    ],
  },
  {
    title: 'Tax & Payment',
    fields: [
      { key: 'default_gst_pct',      label: 'Default GST %',        type: 'number' },
      { key: 'credit_days',          label: 'Default Credit Days',  type: 'number' },
      { key: 'bank_name',            label: 'Bank Name',            type: 'text' },
      { key: 'bank_account_no',      label: 'Account Number',       type: 'text' },
      { key: 'bank_ifsc',            label: 'IFSC Code',            type: 'text' },
    ],
  },
];

export default function SettingsPage() {
  const [form, setForm] = useState({});
  const [dirty, setDirty] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn:  () => settingsApi.get().then(r => {
      setForm(r.data?.data || {});
      return r.data;
    }),
    retry: false,
    onError: () => {}, // settings endpoint may not exist yet — page still renders
  });

  const saveMut = useMutation({
    mutationFn: () => settingsApi.update(form),
    onSuccess:  () => { toast.success('Settings saved'); setDirty(false); },
    onError:    (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }));
    setDirty(true);
  }

  if (isLoading) {
    return <div style={{ padding: 32, color: 'var(--color-text-muted)' }}>Loading settings…</div>;
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        actions={
          <Button onClick={() => saveMut.mutate()} loading={saveMut.isPending} disabled={!dirty}>
            Save Changes
          </Button>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 860 }}>
        {SECTIONS.map(section => (
          <section key={section.title}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
              {section.title}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {section.fields.map(({ key, label, type }) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    {label}
                  </span>
                  <input
                    type={type}
                    value={form[key] ?? ''}
                    onChange={e => set(key, e.target.value)}
                    style={{
                      padding: '7px 10px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)',
                      background: '#fff',
                    }}
                  />
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      {dirty && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--color-primary)', color: '#fff', padding: '10px 20px', borderRadius: 8, boxShadow: 'var(--shadow-lg)', fontSize: 13 }}>
          Unsaved changes — don't forget to save!
        </div>
      )}
    </div>
  );
}
