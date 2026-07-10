import api from './api';
export const salesApi = {
  list:    (params) => api.get('/sales', { params }),
  get:     (id)     => api.get(`/sales/${id}`),
  create:  (data)   => api.post('/sales', data),
  cancel:  (id)     => api.post(`/sales/${id}/cancel`),
  pdfUrl:  (id)     => `${api.defaults.baseURL}/sales/${id}/pdf`,
};
