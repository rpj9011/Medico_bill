import api from './api';
export const productsApi = {
  list:       (params) => api.get('/products', { params }),
  get:        (id)     => api.get(`/products/${id}`),
  getBatches: (id, p)  => api.get(`/products/${id}/batches`, { params: p }),
  create:     (data)   => api.post('/products', data),
  update:     (id, d)  => api.put(`/products/${id}`, d),
  remove:     (id)     => api.delete(`/products/${id}`),
};
