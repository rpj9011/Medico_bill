import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { partiesApi } from '../../services/parties.service';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import PartyForm from './PartyForm';

export default function PartiesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [modal,  setModal]  = useState({ open: false, party: null });

  const { data, isLoading } = useQuery({
    queryKey: ['parties', search, filter],
    queryFn:  () => partiesApi.list({ search, type: filter || undefined, limit: 100 }).then(r => r.data),
    staleTime: 30_000,
  });

  const saveMut = useMutation({
    mutationFn: (d) => d.id ? partiesApi.update(d.id, d) : partiesApi.create(d),
    onSuccess: () => { toast.success('Party saved'); qc.invalidateQueries(['parties']); setModal({ open: false, party: null }); },
    onError:   (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  const cols = [
    { key: 'party_code', header: 'Code',     width: 80 },
    { key: 'name',       header: 'Name' },
    { key: 'party_type', header: 'Type',     render: v => v.charAt(0).toUpperCase() + v.slice(1), width: 80 },
    { key: 'mobile',     header: 'Mobile',   width: 120 },
    { key: 'gst_number', header: 'GSTIN',    width: 160 },
    { key: 'credit_limit', header: 'Credit Limit', render: v => `₹ ${Number(v||0).toLocaleString()}`, align: 'right', width: 100 },
  ];

  return (
    <div>
      <PageHeader
        title="Parties"
        subtitle="Customers & Suppliers"
        actions={<Button onClick={() => setModal({ open: true, party: null })}>+ New Party</Button>}
      />
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, code, GST…" />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}>
          <option value="">All Types</option>
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>
      <DataTable columns={cols} data={data?.data || []} loading={isLoading} onRowClick={p => setModal({ open: true, party: p })} />

      <Modal open={modal.open} title={modal.party ? 'Edit Party' : 'New Party'} onClose={() => setModal({ open: false, party: null })} width={700}>
        <PartyForm initial={modal.party} onSave={saveMut.mutate} saving={saveMut.isPending} />
      </Modal>
    </div>
  );
}
