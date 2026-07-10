import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { productsApi } from '../../services/products.service';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { fmt } from '../../utils/format';

const schemesApi = {
  list:   (p) => api.get('/schemes', { params: p }),
  create: (d) => api.post('/schemes', d),
  update: (id, d) => api.put(`/schemes/${id}`, d),
  remove: (id) => api.delete(`/schemes/${id}`),
};

const EMPTY = { product_id: '', product_name: '', scheme_qty: 10, scheme_free_qty: 1, discount_pct: 0, valid_from: '', valid_to: '', is_active: true };

function SchemeForm({ initial, onSave, saving }) {
  const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) });
  const [prodSugg, setProdSugg] = useState([]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function searchProd(q) {
    set('product_name', q); set('product_id', '');
    if (q.length < 2) { setProdSugg([]); return; }
    const r = await productsApi.list({ search: q, limit: 8 });
    setProdSugg(r.data.data || []);
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ position: 'relative' }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>PRODUCT *</label>
        <input value={form.product_name} onChange={e => searchProd(e.target.value)} placeholder="Search product…" autoComplete="off"
          style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }} />
        {prodSugg.length > 0 && (
          <ul style={{ position: 'absolute', zIndex: 200, left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', listStyle: 'none', padding: 0, margin: '2px 0 0' }}>
            {prodSugg.map(p => (
              <li key={p.id} onClick={() => { set('product_id', p.id); set('product_name', p.product_name); setProdSugg([]); }}
                style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 'var(--text-sm)', borderBottom: '1px solid #f0f4f8' }}>
                {p.product_name} <small style={{ color: 'var(--color-text-muted)' }}>{p.pack}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {[['Buy Qty', 'scheme_qty'], ['Free Qty', 'scheme_free_qty'], ['Discount %', 'discount_pct']].map(([lbl, key]) => (
          <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            {lbl}
            <input type="number" min="0" step="0.001" value={form[key]} onChange={e => set(key, e.target.value)}
              style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }} />
          </label>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[['Valid From', 'valid_from'], ['Valid To', 'valid_to']].map(([lbl, key]) => (
          <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            {lbl}
            <input type="date" value={form[key] || ''} onChange={e => set(key, e.target.value)}
              style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }} />
          </label>
        ))}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)' }}>
        <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
        Active
      </label>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="submit" loading={saving}>Save Scheme</Button>
      </div>
    </form>
  );
}

export default function SchemesPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState({ open: false, scheme: null });

  const { data, isLoading } = useQuery({
    queryKey: ['schemes'],
    queryFn:  () => schemesApi.list({}).then(r => r.data),
  });

  const saveMut = useMutation({
    mutationFn: (d) => d.id ? schemesApi.update(d.id, d) : schemesApi.create(d),
    onSuccess:  () => { toast.success('Scheme saved'); qc.invalidateQueries(['schemes']); setModal({ open: false }); },
    onError:    (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  const cols = [
    { key: 'Product',     header: 'Product',    render: (_, r) => r.Product?.product_name || '—' },
    { key: 'scheme_qty',  header: 'Buy Qty',    render: v => Number(v).toFixed(0), align: 'right', width: 70 },
    { key: 'scheme_free_qty', header: 'Free Qty', render: v => Number(v).toFixed(0), align: 'right', width: 70 },
    { key: 'discount_pct', header: 'Disc%',     render: v => `${Number(v).toFixed(1)}%`, align: 'right', width: 70 },
    { key: 'valid_from',  header: 'Valid From', render: v => fmt.date(v), width: 100 },
    { key: 'valid_to',    header: 'Valid To',   render: v => fmt.date(v), width: 100 },
    { key: 'is_active',   header: 'Status',     render: v => <span style={{ color: v ? '#27ae60' : '#c0392b', fontWeight: 600 }}>{v ? 'Active' : 'Inactive'}</span>, width: 80 },
  ];

  return (
    <div>
      <PageHeader title="Schemes & Discounts" actions={<Button onClick={() => setModal({ open: true, scheme: null })}>+ New Scheme</Button>} />
      <DataTable columns={cols} data={data?.data || []} loading={isLoading} onRowClick={s => setModal({ open: true, scheme: s })} />
      <Modal open={modal.open} title={modal.scheme ? 'Edit Scheme' : 'New Scheme'} onClose={() => setModal({ open: false })} width={560}>
        <SchemeForm initial={modal.scheme} onSave={saveMut.mutate} saving={saveMut.isPending} />
      </Modal>
    </div>
  );
}
