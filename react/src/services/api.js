import axios from 'axios';

const API_URL = 'https://hackindia-spark-4-ncr-east-region-byte.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
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

/**
 * Authentication endpoints
 */
export const authAPI = {
  register: (email, password, role, walletAddress) =>
    api.post('/auth/register', {
      email,
      password,
      role,
      walletAddress,
    }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  verify: () => api.post('/auth/verify'),
};

/**
 * User endpoints
 */
export const userAPI = {
  register: (walletAddress, email) =>
    api.post('/users/register', { walletAddress, email }),

  getProfile: () => api.get('/users/profile'),

  getTransactions: () => api.get('/users/transactions'),

  getPurchases: () => api.get('/users/purchases'),
};

/**
 * Policy endpoints
 */
export const policyAPI = {
  getAll: () => api.get('/policies'),

  getById: (policyId) => api.get(`/policies/${policyId}`),

  getUserPolicies: () => api.get('/policies/user/mypolicies'),

  getPayoutBalance: () => api.get('/policies/user/payout'),

  purchase: (policyId) =>
    api.post(`/policies/purchase/${policyId}`),
};

/**
 * Admin endpoints
 */
export const adminAPI = {
  createPolicy: (policy) =>
    api.post('/admin/policies/create', policy),

  getAllUsers: (limit = 100, offset = 0) =>
    api.get('/admin/users', { params: { limit, offset } }),

  getDashboardStats: () => api.get('/admin/dashboard'),

  triggerPayout: (data) =>
    api.post('/admin/payouts/trigger', data),
};

export default api;
