import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { stockApi } from '../../services/stock.service';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import { fmt } from '../../utils/format';

export default function StockPage() {
  const [tab, setTab] = useState('summary');
  const [lowStock, setLowStock] = useState(false);
  const [expiryDays, setExpiryDays] = useState(90);

  const summary = useQuery({
    queryKey: ['stock-summary', lowStock],
    queryFn:  () => stockApi.summary({ low_stock: lowStock }).then(r => r.data),
    enabled:  tab === 'summary',
  });

  const expiry = useQuery({
    queryKey: ['stock-expiry', expiryDays],
    queryFn:  () => stockApi.expiry({ days: expiryDays }).then(r => r.data),
    enabled:  tab === 'expiry',
  });

  const summaryCols = [
    { key: 'product', header: 'Product',   render: (_, r) => r.Product?.product_name },
    { key: 'batch_no', header: 'Batch' },
    { key: 'expiry_date', header: 'Expiry', render: v => fmt.date(v) },
    { key: 'godown',  header: 'Godown',    render: (_, r) => r.Godown?.godown_name },
    { key: 'mrp',     header: 'MRP',       render: v => fmt.currency(v), align: 'right' },
    { key: 'quantity_on_hand', header: 'Qty',  render: v => fmt.qty(v), align: 'right' },
  ];

  return (
    <div>
      <PageHeader title="Stock" subtitle="Batch-wise inventory" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['summary', 'expiry'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: 20, border: 'none', background: tab === t ? 'var(--color-primary)' : 'var(--color-bg)', color: tab === t ? '#fff' : 'var(--color-text)', cursor: 'pointer', fontWeight: 600 }}>{t === 'summary' ? 'Stock Summary' : 'Expiry Alert'}</button>
        ))}
      </div>

      {tab === 'summary' && (
        <>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 'var(--text-sm)' }}>
            <input type="checkbox" checked={lowStock} onChange={e => setLowStock(e.target.checked)} />
            Show only low-stock items
          </label>
          <DataTable columns={summaryCols} data={summary.data?.data || []} loading={summary.isLoading} />
        </>
      )}

      {tab === 'expiry' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <label style={{ fontSize: 'var(--text-sm)' }}>
              Expiring within <input type="number" min="1" value={expiryDays} onChange={e => setExpiryDays(e.target.value)} style={{ width: 60, padding: '4px 6px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} /> days
            </label>
          </div>
          <DataTable columns={summaryCols} data={expiry.data?.data || []} loading={expiry.isLoading} />
        </>
      )}
    </div>
  );
}
