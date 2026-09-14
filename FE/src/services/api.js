import axios from 'axios';

// Axios instance với baseURL từ biến môi trường Vite
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

// Interceptor: tự động gắn JWT token vào header Authorization nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: nếu 401/403 thì xoá token, chuyển về trang login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const isAdminRoute = window.location.pathname.startsWith('/btc-admin');
      if (isAdminRoute) {
        localStorage.removeItem('adminToken');
        window.location.href = '/btc-admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
