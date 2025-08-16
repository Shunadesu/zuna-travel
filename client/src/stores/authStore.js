import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../contexts/ApiContext';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login
      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const response = await api.auth.login(credentials);
          const { token, ...userData } = response.data;
          
          set({
            user: userData,
            token,
            isAuthenticated: true,
            loading: false,
          });

          // Store token in localStorage
          localStorage.setItem('authToken', token);
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Login failed', 
            loading: false 
          });
          throw error;
        }
      },

      // Register
      register: async (userData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.auth.register(userData);
          const { token, ...user } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          // Store token in localStorage
          localStorage.setItem('authToken', token);
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Registration failed', 
            loading: false 
          });
          throw error;
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('authToken');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Get profile
      getProfile: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.auth.getProfile();
          set({
            user: response.data,
            loading: false,
          });
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to get profile', 
            loading: false 
          });
          throw error;
        }
      },

      // Update profile
      updateProfile: async (profileData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.auth.updateProfile(profileData);
          const { token, ...userData } = response.data;
          
          set({
            user: userData,
            token: token || get().token,
            loading: false,
          });

          // Update token if provided
          if (token) {
            localStorage.setItem('authToken', token);
          }
          
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to update profile', 
            loading: false 
          });
          throw error;
        }
      },

      // Change password
      changePassword: async (passwordData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.auth.changePassword(passwordData);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to change password', 
            loading: false 
          });
          throw error;
        }
      },

      // Forgot password
      forgotPassword: async (email) => {
        try {
          set({ loading: true, error: null });
          const response = await api.auth.forgotPassword({ email });
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to send reset email', 
            loading: false 
          });
          throw error;
        }
      },

      // Reset password
      resetPassword: async (resetData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.auth.resetPassword(resetData);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to reset password', 
            loading: false 
          });
          throw error;
        }
      },

      // Initialize auth state from localStorage
      initializeAuth: () => {
        const token = localStorage.getItem('authToken');
        if (token) {
          set({ token, isAuthenticated: true });
          // Optionally fetch user profile
          get().getProfile().catch(() => {
            // If profile fetch fails, clear auth state
            get().logout();
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
