import api from './api';
export const reportsApi = {
  salesRegister:      (p) => api.get('/reports/sales-register', { params: p }),
  purchaseRegister:   (p) => api.get('/reports/purchase-register', { params: p }),
  gstSummary:         (p) => api.get('/reports/gst-summary', { params: p }),
  salesmanCollection: (p) => api.get('/reports/salesman-collection', { params: p }),
};
