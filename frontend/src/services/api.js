import axios from 'axios';

function resolveBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL;
  if (configuredUrl) return configuredUrl;

  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return 'http://localhost:3001/api';
  }

  return '/api';
}

const api = axios.create({ baseURL: resolveBaseUrl(), timeout: 30_000 });

// Attach JWT on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally, but skip the login page so auth failures surface normally.
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
