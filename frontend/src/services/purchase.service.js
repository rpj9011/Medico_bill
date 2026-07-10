import api from './api';
export const purchaseApi = {
  list:   (params) => api.get('/purchase', { params }),
  get:    (id)     => api.get(`/purchase/${id}`),
  create: (data)   => api.post('/purchase', data),
  cancel: (id)     => api.post(`/purchase/${id}/cancel`),
};
