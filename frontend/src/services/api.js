import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const user = {
  getCoupons: () => api.get('/users/coupons'),
  useCoupon: (code) => api.put(`/users/coupons/${code}/use`),
};

export const admin = {
  getAllUsers: () => api.get('/admin/users'),
  approveUser: (userId) => api.put(`/admin/users/${userId}/approve`),
  generateCoupon: (couponData) => api.post('/admin/coupons', null, { params: couponData }),
  assignCoupon: (couponId, userEmail) => 
    api.post(`/admin/coupons/${couponId}/assign`, null, { params: { userEmail } }),
  getNewCoupons:()=> api.get('admin/coupons/un-assigned'),
  getAssignedCoupons:()=> api.get('admin/coupons/assigned')
};

export default api;