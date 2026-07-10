import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ledgerApi } from '../../services/ledger.service';
import { partiesApi } from '../../services/parties.service';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import { fmt } from '../../utils/format';

export default function LedgerPage() {
  const [partyId, setPartyId]   = useState('');
  const [partySearch, setPartySearch] = useState('');
  const [partySugg, setPartySugg]     = useState([]);
  const [dates, setDates] = useState({ from: '', to: '' });

  async function searchParty(q) {
    setPartySearch(q);
    if (q.length < 2) { setPartySugg([]); return; }
    const r = await partiesApi.list({ search: q, limit: 8 });
    setPartySugg(r.data.data || []);
  }

  const { data, isLoading } = useQuery({
    queryKey: ['ledger', partyId, dates],
    queryFn:  () => ledgerApi.partyLedger(partyId, { from_date: dates.from, to_date: dates.to }).then(r => r.data),
    enabled:  !!partyId,
  });

  const cols = [
    { key: 'transaction_date', header: 'Date',       render: v => fmt.date(v) },
    { key: 'voucher_type',     header: 'Type' },
    { key: 'voucher_no',       header: 'Voucher No' },
    { key: 'narration',        header: 'Narration' },
    { key: 'debit_amount',     header: 'Debit',   render: v => Number(v) > 0 ? fmt.currency(v) : '—', align: 'right' },
    { key: 'credit_amount',    header: 'Credit',  render: v => Number(v) > 0 ? fmt.currency(v) : '—', align: 'right' },
    { key: 'running_balance',  header: 'Balance', render: v => <span style={{ color: v > 0 ? '#c0392b' : '#27ae60', fontWeight: 600 }}>{fmt.currency(Math.abs(v))}{v > 0 ? ' Dr' : ' Cr'}</span>, align: 'right' },
  ];

  return (
    <div>
      <PageHeader title="Party Ledger" />
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ position: 'relative' }}>
          <input
            value={partySearch}
            onChange={e => searchParty(e.target.value)}
            placeholder="Search party…"
            style={{ padding: '7px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', width: 240 }}
          />
          {partySugg.length > 0 && (
            <ul style={{ position: 'absolute', zIndex: 200, left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', listStyle: 'none', padding: 0, margin: '2px 0 0' }}>
              {partySugg.map(p => (
                <li key={p.id} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: 'var(--text-sm)' }}
                  onClick={() => { setPartyId(p.id); setPartySearch(p.name); setPartySugg([]); }}>
                  {p.name} <small>{p.party_code}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
        <input type="date" value={dates.from} onChange={e => setDates(d => ({ ...d, from: e.target.value }))} style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
        <input type="date" value={dates.to}   onChange={e => setDates(d => ({ ...d, to: e.target.value }))} style={{ padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
      </div>

      {partyId ? (
        <>
          <DataTable columns={cols} data={data?.data || []} loading={isLoading} />
          {data?.closing_balance !== undefined && (
            <div style={{ textAlign: 'right', marginTop: 12, fontWeight: 700, fontSize: 'var(--text-base)' }}>
              Closing Balance: <span style={{ color: data.closing_balance > 0 ? '#c0392b' : '#27ae60' }}>
                {fmt.currency(Math.abs(data.closing_balance))} {data.closing_balance > 0 ? 'Dr' : 'Cr'}
              </span>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 48 }}>Search and select a party to view its ledger.</p>
      )}
    </div>
  );
}
