import axios from 'axios';

// Base URL comes from the Vite environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

// Attach the JWT automatically to every request if one is stored
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/api/auth/register', data);
export const loginUser = (data) => API.post('/api/auth/login', data);
export const getMe = () => API.get('/api/auth/me');

// ── Products ──────────────────────────────────────────────────────────────────
export const fetchProducts = () => API.get('/api/products');
export const fetchProduct = (id) => API.get(`/api/products/${id}`);
export const createProduct = (data) => API.post('/api/products', data);
export const updateProduct = (id, data) => API.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);

// ── Stock ─────────────────────────────────────────────────────────────────────
export const adjustStock = (data) => API.post('/api/stock/adjust', data);
export const fetchStockMovements = () => API.get('/api/stock/movements');

// ── Orders ────────────────────────────────────────────────────────────────────
export const createOrder = (data) => API.post('/api/orders', data);
export const fetchMyOrders = () => API.get('/api/orders/my-orders');
export const fetchAllOrders = () => API.get('/api/orders');

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const fetchDashboardStats = () => API.get('/api/dashboard/stats');
export const fetchRecentOrders = () => API.get('/api/dashboard/recent-orders');
export const fetchLowStock = () => API.get('/api/dashboard/low-stock');

export default API;

