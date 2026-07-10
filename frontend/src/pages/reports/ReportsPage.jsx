import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../services/reports.service';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { fmt } from '../../utils/format';

const TABS = ['sales-register', 'purchase-register', 'gst-summary', 'salesman-collection'];

export default function ReportsPage() {
  const [tab,   setTab]   = useState('sales-register');
  const [dates, setDates] = useState({ from: '', to: '' });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['report', tab, dates],
    queryFn: () => {
      const p = { from_date: dates.from, to_date: dates.to };
      if (tab === 'sales-register')      return reportsApi.salesRegister(p).then(r => r.data);
      if (tab === 'purchase-register')   return reportsApi.purchaseRegister(p).then(r => r.data);
      if (tab === 'gst-summary')         return reportsApi.gstSummary(p).then(r => r.data);
      if (tab === 'salesman-collection') return reportsApi.salesmanCollection(p).then(r => r.data);
    },
    enabled: false,
  });

  const salesCols = [
    { key: 'invoice_date', header: 'Date',      render: v => fmt.date(v) },
    { key: 'voucher_no',   header: 'Voucher No' },
    { key: 'customer',     header: 'Customer',  render: (_, r) => r.Party?.name || r.customer?.name || '—' },
    { key: 'net_amount',   header: 'Net Amt',   render: v => fmt.currency(v), align: 'right' },
  ];
  const purchaseCols = [
    { key: 'bill_date',  header: 'Date',     render: v => fmt.date(v) },
    { key: 'bill_no',    header: 'Bill No' },
    { key: 'supplier',   header: 'Supplier', render: (_, r) => r.Party?.name || r.supplier?.name || '—' },
    { key: 'net_amount', header: 'Net Amt',  render: v => fmt.currency(v), align: 'right' },
  ];
  const gstCols = [
    { key: 'hsn_code',       header: 'HSN Code' },
    { key: 'taxable_amount', header: 'Taxable',  render: v => fmt.currency(v), align: 'right' },
    { key: 'sgst_amount',    header: 'SGST',     render: v => fmt.currency(v), align: 'right' },
    { key: 'cgst_amount',    header: 'CGST',     render: v => fmt.currency(v), align: 'right' },
    { key: 'igst_amount',    header: 'IGST',     render: v => fmt.currency(v), align: 'right' },
    { key: 'cess_amount',    header: 'CESS',     render: v => fmt.currency(v), align: 'right' },
  ];
  const salesmanCols = [
    { key: 'salesman_name',   header: 'Salesman' },
    { key: 'invoice_count',   header: 'Bills',      align: 'right' },
    { key: 'total_billed',    header: 'Total Billed',   render: v => fmt.currency(v), align: 'right' },
    { key: 'total_collected', header: 'Collected',      render: v => fmt.currency(v), align: 'right' },
    { key: 'total_outstanding',header: 'Outstanding',   render: v => fmt.currency(v), align: 'right' },
  ];

  const colsMap = { 'sales-register': salesCols, 'purchase-register': purchaseCols, 'gst-summary': gstCols, 'salesman-collection': salesmanCols };

  return (
    <div>
      <PageHeader title="Reports" />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', background: tab === t ? 'var(--color-primary)' : 'var(--color-bg)', color: tab === t ? '#fff' : 'var(--color-text)', cursor: 'pointer', fontWeight: 500, fontSize: 'var(--text-sm)' }}>
            {t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <input type="date" value={dates.from} onChange={e => setDates(d => ({ ...d, from: e.target.value }))} style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
        <span style={{ color: 'var(--color-text-muted)' }}>to</span>
        <input type="date" value={dates.to}   onChange={e => setDates(d => ({ ...d, to: e.target.value }))} style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
        <Button onClick={() => refetch()}>Generate</Button>
      </div>

      <DataTable columns={colsMap[tab] || []} data={data?.data || []} loading={isLoading} />

      {data?.totals && (
        <div style={{ textAlign: 'right', marginTop: 12, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Total Net: <strong style={{ color: 'var(--color-text)' }}>{fmt.currency(data.totals.net)}</strong>
        </div>
      )}
    </div>
  );
}
