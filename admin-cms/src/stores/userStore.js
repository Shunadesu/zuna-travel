import { create } from 'zustand';
import api from '../contexts/ApiContext';

const useUserStore = create((set, get) => ({
  // State
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all users
  fetchUsers: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/users?${queryParams.toString()}`);
      
      set({
        users: response.data.data,
        pagination: response.data.pagination,
        loading: false
      });
      
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch users',
        loading: false
      });
      throw error;
    }
  },

  // Fetch single user
  fetchUser: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get(`/users/${id}`);
      
      set({
        currentUser: response.data.data,
        loading: false
      });
      
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch user',
        loading: false
      });
      throw error;
    }
  },

  // Create user
  createUser: async (userData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.post('/users', userData);
      
      // Add new user to the list
      const { users } = get();
      set({
        users: [response.data.data, ...users],
        loading: false
      });
      
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create user',
        loading: false
      });
      throw error;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.put(`/users/${id}`, userData);
      
      // Update user in the list
      const { users } = get();
      const updatedUsers = users.map(user => 
        user._id === id ? response.data.data : user
      );
      
      set({
        users: updatedUsers,
        currentUser: response.data.data,
        loading: false
      });
      
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update user',
        loading: false
      });
      throw error;
    }
  },

  // Update user status
  updateUserStatus: async (id, isActive) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.patch(`/users/${id}/status`, { isActive });
      
      // Update user in the list
      const { users } = get();
      const updatedUsers = users.map(user => 
        user._id === id ? response.data.data : user
      );
      
      set({
        users: updatedUsers,
        currentUser: response.data.data,
        loading: false
      });
      
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update user status',
        loading: false
      });
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      set({ loading: true, error: null });
      
      await api.delete(`/users/${id}`);
      
      // Remove user from the list
      const { users } = get();
      const filteredUsers = users.filter(user => user._id !== id);
      
      set({
        users: filteredUsers,
        currentUser: null,
        loading: false
      });
      
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete user',
        loading: false
      });
      throw error;
    }
  },

  // Get current user profile
  fetchProfile: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get('/users/profile/me');
      
      set({
        currentUser: response.data.data,
        loading: false
      });
      
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch profile',
        loading: false
      });
      throw error;
    }
  },

  // Update current user profile
  updateProfile: async (profileData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.put('/users/profile/me', profileData);
      
      set({
        currentUser: response.data.data,
        loading: false
      });
      
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update profile',
        loading: false
      });
      throw error;
    }
  },

  // Clear current user
  clearCurrentUser: () => set({ currentUser: null }),

  // Reset store
  reset: () => set({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0
    }
  })
}));

export default useUserStore;


