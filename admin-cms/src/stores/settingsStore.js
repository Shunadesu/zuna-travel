import { create } from 'zustand';
import apiClient from '../utils/apiConfig';

const useSettingsStore = create((set, get) => ({
  // State
  settings: null,
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 10 * 60 * 1000, // 10 minutes for settings

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch settings
  fetchSettings: async (forceRefresh = false) => {
    const { settings, lastFetched, cacheExpiry } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && settings && lastFetched && (now - lastFetched) < cacheExpiry) {
      return settings;
    }

    set({ loading: true, error: null });

    try {
      // Use public route for initial fetch
      const response = await apiClient.get('/settings');
      const fetchedSettings = response.data.data;
      
      set({ 
        settings: fetchedSettings, 
        lastFetched: now,
        loading: false 
      });

      return fetchedSettings;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch settings',
        loading: false 
      });
      throw error;
    }
  },

  // Update settings
  updateSettings: async (updateData) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.put('/settings', updateData);
      const updatedSettings = response.data.data;
      
      set({ 
        settings: updatedSettings,
        loading: false 
      });

      return updatedSettings;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update settings',
        loading: false 
      });
      throw error;
    }
  },

  // Reset settings to defaults
  resetSettings: async () => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.post('/settings/reset');
      const resetSettings = response.data.data;
      
      set({ 
        settings: resetSettings,
        loading: false 
      });

      return resetSettings;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to reset settings',
        loading: false 
      });
      throw error;
    }
  },

  // Get specific setting group
  fetchSettingGroup: async (group) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get(`/settings/group/${group}`);
      const groupData = response.data.data;
      
      set({ loading: false });
      return groupData;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch setting group',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch settings with admin privileges
  fetchSettingsAdmin: async () => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get('/settings/admin');
      const fetchedSettings = response.data.data;
      
      set({ 
        settings: fetchedSettings, 
        lastFetched: Date.now(),
        loading: false 
      });

      return fetchedSettings;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch settings with admin privileges',
        loading: false 
      });
      throw error;
    }
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    settings: null, 
    loading: false, 
    error: null, 
    lastFetched: null 
  }),
}));

export default useSettingsStore;
