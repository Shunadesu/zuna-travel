import axios from 'axios';

// API base URL
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://zuna-travel.onrender.com/api';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


// Retry configuration
const RETRY_DELAYS = [1000, 2000, 4000]; // Delays in milliseconds
const MAX_RETRIES = 3;

// Create axios instance with interceptors
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
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to add retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    
    // Only retry on 429 errors or network errors
    if ((error.response?.status === 429 || !error.response) && config && !config._retry) {
      config._retry = true;
      
      // Get retry count from config
      const retryCount = config._retryCount || 0;
      
      if (retryCount < MAX_RETRIES) {
        config._retryCount = retryCount + 1;
        
        // Wait before retrying
        const delay = RETRY_DELAYS[retryCount] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry the request
        return apiClient(config);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
