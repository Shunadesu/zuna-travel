import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://zuna-travel.onrender.com/api';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
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
            console.error('Session expired. Please login again.');
          } else {
            console.error('Unauthorized access.');
          }
          window.location.href = '/auth/login';
          break;
          
        case 403:
          console.error('Access forbidden.');
          break;
          
        case 404:
          console.error('Resource not found.');
          break;
          
        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach(err => console.error(err.msg || err.message));
          } else {
            console.error(data.message || 'Validation failed.');
          }
          break;
          
        case 429:
          console.error('Too many requests. Please try again later.');
          break;
          
        case 500:
        default:
          console.error(data.message || 'An error occurred. Please try again.');
          break;
      }
    } else if (error.request) {
      // Network error
      console.error('Network error. Please check your connection.');
    } else {
      // Other error
      console.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
