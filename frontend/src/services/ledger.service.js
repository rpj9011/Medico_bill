import api from './api';
export const ledgerApi = {
  partyLedger: (partyId, params) => api.get(`/ledger/party/${partyId}`, { params }),
  outstanding:  (params)         => api.get('/ledger/outstanding', { params }),
  createReceipt: (data)          => api.post('/ledger/receipt', data),
  createNote:    (data)          => api.post('/ledger/note', data),
};
