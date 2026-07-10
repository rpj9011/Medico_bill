import api from './api';
export const authApi = {
  login:  (username, password) => api.post('/auth/login', { username, password }),
  me:     ()                   => api.get('/auth/me'),
  listUsers: ()                => api.get('/auth/users'),
  createUser: (data)           => api.post('/auth/users', data),
  updateUser: (id, data)       => api.put(`/auth/users/${id}`, data),
  savePermissions: (data)      => api.post('/auth/users/permissions', data),
};
