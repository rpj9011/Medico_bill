import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productsApi } from '../../services/products.service';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SearchInput from '../../components/common/SearchInput';
import ProductForm from './ProductForm';

export default function ProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState({ open: false, product: null });

  const { data, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn:  () => productsApi.list({ search, limit: 100 }).then(r => r.data),
  });

  const saveMut = useMutation({
    mutationFn: (d) => d.id ? productsApi.update(d.id, d) : productsApi.create(d),
    onSuccess:  () => { toast.success('Product saved'); qc.invalidateQueries(['products']); setModal({ open: false }); },
    onError:    (e) => toast.error(e.response?.data?.message || 'Save failed'),
  });

  const cols = [
    { key: 'product_code', header: 'Code',    width: 90 },
    { key: 'product_name', header: 'Product' },
    { key: 'pack',         header: 'Pack',    width: 70 },
    { key: 'Company',      header: 'Company', render: (_, row) => row.Company?.company_name || '—' },
    { key: 'hsn_code',     header: 'HSN',     width: 80 },
    { key: 'mrp',          header: 'MRP',     render: v => `₹ ${Number(v||0).toFixed(2)}`, align: 'right', width: 80 },
    { key: 'is_dpco_controlled', header: 'DPCO', render: v => v ? '⚠ DPCO' : '—', width: 60 },
  ];

  return (
    <div>
      <PageHeader title="Products" actions={<Button onClick={() => setModal({ open: true, product: null })}>+ New Product</Button>} />
      <div style={{ marginBottom: 16 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search product name, code, barcode…" />
      </div>
      <DataTable columns={cols} data={data?.data || []} loading={isLoading} onRowClick={p => setModal({ open: true, product: p })} />
      <Modal open={modal.open} title={modal.product ? 'Edit Product' : 'New Product'} onClose={() => setModal({ open: false })} width={750}>
        <ProductForm initial={modal.product} onSave={saveMut.mutate} saving={saveMut.isPending} />
      </Modal>
    </div>
  );
}
