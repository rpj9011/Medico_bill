import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { purchaseApi } from '../../services/purchase.service';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { fmt } from '../../utils/format';
import PurchaseForm from './PurchaseForm';

export default function PurchasePage() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState({ from_date: '', to_date: '' });
  const [modal, setModal]     = useState({ open: false, invoice: null });

  const { data, isLoading } = useQuery({
    queryKey: ['purchase', filters],
    queryFn:  () => purchaseApi.list(filters).then(r => r.data),
  });

  const cancelMut = useMutation({
    mutationFn: (id) => purchaseApi.cancel(id),
    onSuccess:  () => { toast.success('Invoice cancelled'); qc.invalidateQueries(['purchase']); },
    onError:    (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const cols = [
    { key: 'bill_date',      header: 'Date',     render: v => fmt.date(v) },
    { key: 'voucher_no',     header: 'Voucher No', width: 120 },
    { key: 'bill_no',        header: 'Bill No' },
    { key: 'supplier',       header: 'Supplier', render: (_, r) => r.Party?.name || r.supplier?.name || '—' },
    { key: 'net_amount',     header: 'Net Amt',  render: v => fmt.currency(v), align: 'right' },
    { key: 'amount_balance', header: 'Balance',  render: v => <span style={{ color: v > 0 ? '#c0392b' : '#27ae60' }}>{fmt.currency(v)}</span>, align: 'right' },
    { key: 'is_cancelled',   header: 'Status',   render: v => v ? <span style={{ color: '#c0392b' }}>Cancelled</span> : <span style={{ color: '#27ae60' }}>Active</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Purchase Invoices"
        actions={<Button onClick={() => setModal({ open: true, invoice: null })}>+ New Purchase</Button>}
      />
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input type="date" value={filters.from_date} onChange={e => setFilters(f => ({ ...f, from_date: e.target.value }))}
          style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
        <input type="date" value={filters.to_date}   onChange={e => setFilters(f => ({ ...f, to_date: e.target.value }))}
          style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
      </div>
      <DataTable columns={cols} data={data?.data || []} loading={isLoading}
        onRowClick={row => setModal({ open: true, invoice: row })} />

      <Modal open={modal.open} title={modal.invoice?.id ? 'View Purchase Invoice' : 'New Purchase Invoice'}
        onClose={() => setModal({ open: false })} width={900}>
        <PurchaseForm
          initial={modal.invoice}
          onSave={async (d) => { await purchaseApi.create(d); toast.success('Purchase saved'); qc.invalidateQueries(['purchase']); setModal({ open: false }); }}
          onCancel={modal.invoice?.id && !modal.invoice.is_cancelled ? () => cancelMut.mutate(modal.invoice.id) : null}
        />
      </Modal>
    </div>
  );
}
