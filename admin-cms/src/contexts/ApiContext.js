import React, { createContext, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create API context
const ApiContext = createContext();

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://zuna-travel.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - remove token and redirect to login
          localStorage.removeItem('adminToken');
          if (data.code === 'TOKEN_EXPIRED') {
            toast.error('Session expired. Please login again.');
          } else {
            toast.error('Unauthorized access.');
          }
          window.location.href = '/auth/login';
          break;
          
        case 403:
          toast.error('Access forbidden.');
          break;
          
        case 404:
          toast.error('Resource not found.');
          break;
          
        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach(err => toast.error(err.msg || err.message));
          } else {
            toast.error(data.message || 'Validation failed.');
          }
          break;
          
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
        default:
          toast.error(data.message || 'An error occurred. Please try again.');
          break;
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API methods
const apiMethods = {
  // Categories
  categories: {
    getAll: (params = {}) => api.get('/categories', { params }),
    getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
    getStats: (id) => api.get(`/categories/${id}/stats`),
  },

  // Products
  products: {
    getAll: (params = {}) => api.get('/products', { params }),
    getBySlug: (slug) => api.get(`/products/slug/${slug}`),
    getById: (id) => api.get(`/products/${id}`),
    getFeatured: (params = {}) => api.get('/products/featured/list', { params }),
    search: (query, params = {}) => api.get('/products/search/text', { params: { q: query, ...params } }),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
  },

  // Transfer Services
  transfers: {
    getAll: (params = {}) => api.get('/transfers', { params }),
    getBySlug: (slug) => api.get(`/transfers/slug/${slug}`),
    search: (params = {}) => api.get('/transfers/search', { params }),
    getTypes: () => api.get('/transfers/types'),
    getSeats: () => api.get('/transfers/seats'),
    getPopularRoutes: (params = {}) => api.get('/transfers/routes/popular', { params }),
    create: (data) => api.post('/transfers', data),
    update: (id, data) => api.put(`/transfers/${id}`, data),
    delete: (id) => api.delete(`/transfers/${id}`),
  },

  // Blogs
  blogs: {
    getAll: (params = {}) => api.get('/blogs', { params }),
    getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
    getById: (id) => api.get(`/blogs/${id}`),
    getFeatured: (params = {}) => api.get('/blogs/featured/list', { params }),
    getByCategory: (category, params = {}) => api.get(`/blogs/category/${category}`, { params }),
    search: (query, params = {}) => api.get('/blogs/search/text', { params: { q: query, ...params } }),
    create: (data) => api.post('/blogs', data),
    update: (id, data) => api.put(`/blogs/${id}`, data),
    delete: (id) => api.delete(`/blogs/${id}`),
  },

  // Upload
  upload: {
    image: (file, folder = 'zuna-travel') => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      return api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    images: (files, folder = 'zuna-travel') => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      formData.append('folder', folder);
      return api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    deleteImage: (publicId) => api.delete(`/upload/image/${encodeURIComponent(publicId)}`),
    editorImage: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return api.post('/upload/editor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    getStats: () => api.get('/upload/stats'),
  },

  // Auth
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data),
    verify: () => api.get('/auth/verify'),
  },

  // Bookings
  bookings: {
    getAll: (params = {}) => api.get('/bookings', { params }),
    getById: (id) => api.get(`/bookings/${id}`),
    update: (id, data) => api.put(`/bookings/${id}`, data),
    cancel: (id, data) => api.put(`/bookings/${id}/cancel`, data),
  },

  // Health check
  health: () => api.get('/health'),
};

// Context Provider
export const ApiProvider = ({ children }) => {
  const value = {
    api: apiMethods,
    axios: api,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook to use API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default api;
