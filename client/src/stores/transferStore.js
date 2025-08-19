import { create } from 'zustand';
import apiClient from '../utils/apiUtils';

const useTransferStore = create((set, get) => ({
  // State
  transfers: [],
  featuredTransfers: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 30 * 60 * 1000, // 30 minutes
  fetchPromise: null, // To prevent multiple simultaneous requests
  fetchFeaturedPromise: null, // To prevent multiple simultaneous requests

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all transfers
  fetchTransfers: async (forceRefresh = false) => {
    const { transfers, lastFetched, cacheExpiry, fetchPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && transfers.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return transfers;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchPromise) {
      return fetchPromise;
    }

    // Only set loading if we don't have any data yet
    if (transfers.length === 0) {
      set({ loading: true, error: null });
    }

    const fetchTransfersPromise = (async () => {
      try {
        const response = await apiClient.get('/transfers');
        const fetchedTransfers = response.data.data;
        
        set({ 
          transfers: fetchedTransfers, 
          lastFetched: now,
          loading: false,
          fetchPromise: null
        });

        return fetchedTransfers;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch transfers',
          loading: false,
          fetchPromise: null
        });
        throw error;
      }
    })();

    set({ fetchPromise: fetchTransfersPromise });
    return fetchTransfersPromise;
  },

  // Fetch featured transfers
  fetchFeaturedTransfers: async (forceRefresh = false) => {
    const { featuredTransfers, lastFetched, cacheExpiry, fetchFeaturedPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && featuredTransfers.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return featuredTransfers;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchFeaturedPromise) {
      return fetchFeaturedPromise;
    }

    set({ loading: true, error: null });

    const fetchFeaturedTransfersPromise = (async () => {
      try {
        const response = await apiClient.get('/transfers?featured=true');
        const fetchedTransfers = response.data.data;
        
        set({ 
          featuredTransfers: fetchedTransfers, 
          lastFetched: now,
          loading: false,
          fetchFeaturedPromise: null
        });

        return fetchedTransfers;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch featured transfers',
          loading: false,
          fetchFeaturedPromise: null
        });
        throw error;
      }
    })();

    set({ fetchFeaturedPromise: fetchFeaturedTransfersPromise });
    return fetchFeaturedTransfersPromise;
  },

  // Get transfer by slug
  getTransferBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/transfers/slug/${slug}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Search transfers
  searchTransfers: async (searchParams) => {
    try {
      const queryParams = new URLSearchParams(searchParams);
      const response = await apiClient.get(`/transfers/search?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get popular routes
  getPopularRoutes: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/transfers/routes/popular?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get transfer types
  getTransferTypes: async () => {
    try {
      const response = await apiClient.get('/transfers/types');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get seat options
  getSeatOptions: async () => {
    try {
      const response = await apiClient.get('/transfers/seats');
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get transfers by category
  getTransfersByCategory: (categorySlug) => {
    const { transfers } = get();
    return transfers?.filter(transfer => transfer.category?.slug === categorySlug) || [];
  },

  // Get active transfers
  getActiveTransfers: () => {
    const { transfers } = get();
    return transfers?.filter(transfer => transfer.isActive) || [];
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    transfers: [], 
    featuredTransfers: [],
    loading: false, 
    error: null, 
    lastFetched: null,
    fetchPromise: null,
    fetchFeaturedPromise: null
  }),
}));

export default useTransferStore;
