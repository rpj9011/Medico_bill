import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { partiesApi } from '../../services/parties.service';
import { productsApi } from '../../services/products.service';
import { calcLine, calcInvoiceTotals, round2 } from '../../utils/gst';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { fmt } from '../../utils/format';

const quotApi = {
  list:   (p) => api.get('/quotations', { params: p }),
  create: (d) => api.post('/quotations', d),
  update: (id, d) => api.put(`/quotations/${id}`, d),
};

const STATUS_COLORS = { draft: '#95a5a6', sent: '#2980b9', converted: '#27ae60', cancelled: '#c0392b' };

function QuotForm({ initial, onSave, saving }) {
  const isView = !!initial?.id;
  const [header, setHeader] = useState({ customer_id: '', customer_name: initial?.customer?.name || '', quotation_date: new Date().toISOString().slice(0,10), valid_till: '', narration: '' });
  const [lines, setLines]   = useState([{ _id: 1, product_id: '', product_name: '', quantity: 1, mrp: 0, rate: 0, discount_pct: 0, gst_pct: 12, line_total: 0, _sugg: [] }]);
  const [custSugg, setCustSugg] = useState([]);

  async function searchCust(q) {
    setHeader(h => ({ ...h, customer_name: q, customer_id: '' }));
    if (q.length < 2) { setCustSugg([]); return; }
    const r = await partiesApi.list({ search: q, type: 'customer', limit: 8 });
    setCustSugg(r.data.data || []);
  }

  function calcLine_(l) {
    const gross = round2(Number(l.rate) * Number(l.quantity));
    const disc  = round2(gross * Number(l.discount_pct) / 100);
    const tax   = round2(gross - disc);
    return { ...l, line_total: round2(tax + tax * Number(l.gst_pct) / 100) };
  }

  function updateLine(idx, patch) {
    setLines(p => p.map((l, i) => i === idx ? calcLine_({ ...l, ...patch }) : l));
  }

  const gross = lines.reduce((a, l) => a + round2(Number(l.rate) * Number(l.quantity)), 0);
  const net   = lines.reduce((a, l) => a + Number(l.line_total), 0);

  if (isView) {
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          {[['Voucher No', initial.voucher_no], ['Date', fmt.date(initial.quotation_date)], ['Valid Till', fmt.date(initial.valid_till)], ['Customer', initial.customer?.name || initial.Party?.name], ['Net Amount', fmt.currency(initial.net_amount)], ['Status', initial.status?.toUpperCase()]].map(([l, v]) => (
            <div key={l}><label style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>{l}</label><strong>{v}</strong></div>
          ))}
        </div>
        {initial.narration && <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{initial.narration}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...header, items: lines.filter(l => l.product_id) }); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>CUSTOMER *</label>
          <input value={header.customer_name} onChange={e => searchCust(e.target.value)} placeholder="Search customer…" autoComplete="off"
            style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 13 }} />
          {custSugg.length > 0 && (
            <ul style={{ position: 'absolute', zIndex: 200, left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4, boxShadow: 'var(--shadow-md)', listStyle: 'none', padding: 0, margin: '2px 0 0' }}>
              {custSugg.map(p => <li key={p.id} onClick={() => { setHeader(h => ({ ...h, customer_id: p.id, customer_name: p.name })); setCustSugg([]); }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid #f0f4f8' }}>{p.name}</li>)}
            </ul>
          )}
        </div>
        {[['Date', 'quotation_date', 'date'], ['Valid Till', 'valid_till', 'date']].map(([lbl, key, type]) => (
          <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            {lbl}<input type={type} value={header[key]} onChange={e => setHeader(h => ({ ...h, [key]: e.target.value }))}
              style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 4, fontSize: 13 }} />
          </label>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead><tr style={{ background: '#f0f4f8' }}>{['Product','Qty','Rate','Disc%','GST%','Total',''].map(h => <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: 11 }}>{h}</th>)}</tr></thead>
        <tbody>
          {lines.map((l, idx) => (
            <tr key={l._id}>
              <td style={{ position: 'relative', minWidth: 160 }}>
                <input value={l.product_name} onChange={async e => {
                  updateLine(idx, { product_name: e.target.value, product_id: '' });
                  if (e.target.value.length < 2) return;
                  const r = await productsApi.list({ search: e.target.value, limit: 6 });
                  setLines(p => p.map((x, i) => i === idx ? { ...x, _sugg: r.data.data || [] } : x));
                }} placeholder="Product…" autoComplete="off" style={{ width: '100%', padding: '4px 6px', border: '1px solid transparent', borderRadius: 3, fontSize: 13, background: 'transparent' }} />
                {l._sugg?.length > 0 && (
                  <ul style={{ position: 'absolute', zIndex: 200, left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border)', borderRadius: 4, boxShadow: 'var(--shadow-md)', listStyle: 'none', padding: 0, margin: '2px 0 0' }}>
                    {l._sugg.map(p => <li key={p.id} onClick={() => updateLine(idx, { product_id: p.id, product_name: p.product_name, mrp: p.mrp, rate: p.sale_rate, gst_pct: p.igst_pct, _sugg: [] })} style={{ padding: '6px 10px', cursor: 'pointer', fontSize: 12, borderBottom: '1px solid #f0f4f8' }}>{p.product_name}</li>)}
                  </ul>
                )}
              </td>
              {[['quantity','number','0.001'],['rate','number','0.01'],['discount_pct','number','0.01'],['gst_pct','number','1']].map(([key, type, step]) => (
                <td key={key}><input type={type} step={step} min="0" value={l[key]} onChange={e => updateLine(idx, { [key]: e.target.value })} style={{ width: 70, padding: '4px 6px', border: '1px solid transparent', borderRadius: 3, fontSize: 13, background: 'transparent', textAlign: 'right' }} /></td>
              ))}
              <td style={{ textAlign: 'right', fontWeight: 600 }}>{Number(l.line_total).toFixed(2)}</td>
              <td><button type="button" onClick={() => setLines(p => p.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => setLines(p => [...p, { _id: Date.now(), product_id:'', product_name:'', quantity:1, mrp:0, rate:0, discount_pct:0, gst_pct:12, line_total:0, _sugg:[] }])}
        style={{ padding: '7px', border: '1px dashed var(--color-border)', borderRadius: 4, background: '#f8fafc', color: 'var(--color-primary)', cursor: 'pointer', fontSize: 13 }}>+ Add Line</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Gross: <strong>{fmt.currency(gross)}</strong> &nbsp; Net: <strong style={{ color: 'var(--color-primary)', fontSize: 15 }}>{fmt.currency(net)}</strong></div>
        <Button type="submit" loading={saving}>Save Quotation</Button>
      </div>
    </form>
  );
}

export default function QuotationsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState({ open: false, quot: null });

  const { data, isLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn:  () => quotApi.list({}).then(r => r.data),
  });

  const saveMut = useMutation({
    mutationFn: (d) => d.id ? quotApi.update(d.id, d) : quotApi.create(d),
    onSuccess:  () => { toast.success('Quotation saved'); qc.invalidateQueries(['quotations']); setModal({ open: false }); },
    onError:    (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  const cols = [
    { key: 'voucher_no',      header: 'Voucher No', width: 120 },
    { key: 'quotation_date',  header: 'Date',       render: v => fmt.date(v) },
    { key: 'customer',        header: 'Customer',   render: (_, r) => r.Party?.name || r.customer?.name || '—' },
    { key: 'net_amount',      header: 'Amount',     render: v => fmt.currency(v), align: 'right' },
    { key: 'valid_till',      header: 'Valid Till', render: v => fmt.date(v) },
    { key: 'status',          header: 'Status',     render: v => <span style={{ color: STATUS_COLORS[v] || '#333', fontWeight: 600, textTransform: 'capitalize' }}>{v}</span> },
  ];

  return (
    <div>
      <PageHeader title="Quotations" actions={<Button onClick={() => setModal({ open: true, quot: null })}>+ New Quotation</Button>} />
      <DataTable columns={cols} data={data?.data || []} loading={isLoading} onRowClick={q => setModal({ open: true, quot: q })} />
      <Modal open={modal.open} title={modal.quot ? 'View Quotation' : 'New Quotation'} onClose={() => setModal({ open: false })} width={760}>
        <QuotForm initial={modal.quot} onSave={saveMut.mutate} saving={saveMut.isPending} />
      </Modal>
    </div>
  );
}
