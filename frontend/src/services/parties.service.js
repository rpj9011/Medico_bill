import api from './api';
export const partiesApi = {
  list:    (params) => api.get('/parties', { params }),
  get:     (id)     => api.get(`/parties/${id}`),
  create:  (data)   => api.post('/parties', data),
  update:  (id, d)  => api.put(`/parties/${id}`, d),
  remove:  (id)     => api.delete(`/parties/${id}`),
};
