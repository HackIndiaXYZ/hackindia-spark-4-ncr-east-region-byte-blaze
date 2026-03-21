import axios from 'axios';

const API_URL = 'https://hackindia-spark-4-ncr-east-region-byte-5yx2.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Unwrap response.data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email, password, role, walletAddress) =>
    api.post('/auth/register', { email, password, role, walletAddress }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  verify: () => api.post('/auth/verify'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  getTransactions: () => api.get('/users/transactions'),
  getPurchases: () => api.get('/users/purchases'),
};

export const policyAPI = {
  getAll: () => api.get('/policies'),
  getById: (id) => api.get(`/policies/${id}`),
  getUserPolicies: () => api.get('/policies/user/mypolicies'),
  purchase: (policyId) => api.post(`/policies/purchase/${policyId}`),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  getAllPurchases: () => api.get('/admin/purchases'),
  createPolicy: (data) => api.post('/admin/policies/create', data),
  updatePolicy: (id, data) => api.put(`/admin/policies/${id}`, data),
  deletePolicy: (id) => api.delete(`/admin/policies/${id}`),
  triggerPayout: (data) => api.post('/admin/payouts/trigger', data),
};

export const weatherAPI = {
  getByLocation: (lat, lon) => api.get(`/weather?lat=${lat}&lon=${lon}`),
};

export default api;
