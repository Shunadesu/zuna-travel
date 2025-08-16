import { create } from 'zustand';
import apiClient from '../utils/apiUtils';

const useSettingsStore = create((set, get) => ({
  // State
  settings: null,
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 30 * 60 * 1000, // 30 minutes for client settings
  fetchPromise: null, // To prevent multiple simultaneous requests

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch settings (public route)
  fetchSettings: async (forceRefresh = false) => {
    const { settings, lastFetched, cacheExpiry, fetchPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && settings && lastFetched && (now - lastFetched) < cacheExpiry) {
      return settings;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchPromise) {
      return fetchPromise;
    }

    set({ loading: true, error: null });

    const fetchSettingsPromise = (async () => {
      try {
        const response = await apiClient.get('/api/settings');
        const fetchedSettings = response.data.data;
        
        set({ 
          settings: fetchedSettings, 
          lastFetched: now,
          loading: false,
          fetchPromise: null
        });

        return fetchedSettings;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch settings',
          loading: false,
          fetchPromise: null
        });
        throw error;
      }
    })();

    set({ fetchPromise: fetchSettingsPromise });
    return fetchSettingsPromise;
  },

  // Get specific setting group
  fetchSettingGroup: async (group) => {
    set({ loading: true, error: null });

          try {
        const response = await apiClient.get(`/api/settings/group/${group}`);
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

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    settings: null, 
    loading: false, 
    error: null, 
    lastFetched: null,
    fetchPromise: null
  }),
}));

export default useSettingsStore;

