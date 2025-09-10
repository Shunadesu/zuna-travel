import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiConfig';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Set default auth header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You can verify token here if needed
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const userData = response.data;
      
      // Store token and user
      localStorage.setItem('adminToken', userData.token);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    // Clear auth data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/auth/login');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
