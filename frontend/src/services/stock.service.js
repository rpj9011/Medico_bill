import api from './api';
export const stockApi = {
  summary:   (params) => api.get('/stock/summary', { params }),
  expiry:    (params) => api.get('/stock/expiry',  { params }),
  movements: (params) => api.get('/stock/movements', { params }),
};
