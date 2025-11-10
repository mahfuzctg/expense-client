import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Debug: Log the full URL being called
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`, config.params ? `Params: ${JSON.stringify(config.params)}` : '');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Debug: Log errors
    if (error.response) {
      const fullUrl = `${error.config?.baseURL}${error.config?.url}`;
      console.error(`[API Error] ${error.response.status} ${error.config?.method?.toUpperCase()} ${fullUrl}`, error.response.data);
    } else if (error.request) {
      console.error(`[API Error] No response received for ${error.config?.method?.toUpperCase()} ${error.config?.baseURL}${error.config?.url}`);
    }
    
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const requestPath = error.config?.url ?? '';
      if (requestPath.includes('/api/auth/me')) {
        localStorage.removeItem('token');
      }
      window.dispatchEvent(
        new CustomEvent('auth:unauthorized', {
          detail: error.response?.data,
        })
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

