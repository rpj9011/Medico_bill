import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { salesApi } from '../../services/sales.service';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { fmt } from '../../utils/format';
import styles from './SalesListPage.module.css';

export default function SalesListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ from_date: '', to_date: '', voucher_type: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['sales', filters],
    queryFn: () => salesApi.list(filters).then(r => r.data),
  });

  const cols = [
    { key: 'invoice_date',   header: 'Date',       render: v => fmt.date(v) },
    { key: 'voucher_no',     header: 'Voucher No' },
    { key: 'voucher_type',   header: 'Type',       render: v => <span className={styles[v]}>{v.toUpperCase()}</span> },
    { key: 'customer',       header: 'Customer',   render: (_, row) => row.Party?.name || row.customer?.name },
    { key: 'net_amount',     header: 'Net Amt',    render: v => fmt.currency(v), align: 'right' },
    { key: 'amount_balance', header: 'Balance',    render: v => <span style={{ color: v > 0 ? '#c0392b' : '#27ae60' }}>{fmt.currency(v)}</span>, align: 'right' },
    { key: 'is_cancelled',   header: 'Status',     render: v => v ? <span style={{color:'#c0392b'}}>Cancelled</span> : <span style={{color:'#27ae60'}}>Active</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Sales"
        actions={<Button onClick={() => navigate('/sales/new')}>+ New Bill</Button>}
      />
      <div className={styles.filters}>
        <input type="date" value={filters.from_date} onChange={e => setFilters(f => ({ ...f, from_date: e.target.value }))} />
        <input type="date" value={filters.to_date}   onChange={e => setFilters(f => ({ ...f, to_date:   e.target.value }))} />
        <select value={filters.voucher_type} onChange={e => setFilters(f => ({ ...f, voucher_type: e.target.value }))}>
          <option value="">All Types</option>
          <option value="credit">Credit</option>
          <option value="cash">Cash</option>
          <option value="counter">Counter</option>
        </select>
      </div>
      <DataTable
        columns={cols}
        data={data?.data || []}
        loading={isLoading}
        onRowClick={row => navigate(`/sales/${row.id}`)}
      />
    </div>
  );
}
