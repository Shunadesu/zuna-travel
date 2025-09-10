import { create } from 'zustand';
import apiClient from '../utils/apiConfig';

const useTransferStore = create((set, get) => ({
  // State
  transfers: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes for admin
  fetchPromise: null,

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

    set({ loading: true, error: null });

    const fetchTransfersPromise = (async () => {
      try {
        const response = await apiClient.get('/transfers?populate=category');
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

  // Create transfer
  createTransfer: async (transferData) => {
    try {
      const response = await apiClient.post('/transfers', transferData);
      const newTransfer = response.data.data;
      
      // Add to local state
      set(state => ({
        transfers: [newTransfer, ...state.transfers]
      }));
      
      return newTransfer;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create transfer' });
      throw error;
    }
  },

  // Update transfer
  updateTransfer: async (id, transferData) => {
    try {
      const response = await apiClient.put(`/transfers/${id}`, transferData);
      const updatedTransfer = response.data.data;
      
      // Update in local state
      set(state => ({
        transfers: state.transfers.map(transfer => 
          transfer._id === id ? updatedTransfer : transfer
        )
      }));
      
      return updatedTransfer;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update transfer' });
      throw error;
    }
  },

  // Delete transfer
  deleteTransfer: async (id) => {
    try {
      await apiClient.delete(`/transfers/${id}`);
      
      // Remove from local state
      set(state => ({
        transfers: state.transfers.filter(transfer => transfer._id !== id)
      }));
      
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete transfer' });
      throw error;
    }
  },

  // Get transfer by ID
  getTransferById: (id) => {
    const { transfers } = get();
    return transfers.find(transfer => transfer._id === id);
  },

  // Fetch single transfer by ID (from API)
  fetchTransferById: async (id) => {
    try {
      const response = await apiClient.get(`/transfers/${id}?populate=category`);
      const transfer = response.data.data;
      
      if (!transfer) {
        throw new Error(`Transfer with ID ${id} not found`);
      }
      
      // Add to local state if not already present
      set(state => {
        const existingTransfer = state.transfers.find(t => t._id === id);
        if (!existingTransfer) {
          return {
            transfers: [transfer, ...state.transfers]
          };
        }
        return state;
      });
      
      return transfer;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch transfer';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Get transfers by category
  getTransfersByCategory: (categorySlug) => {
    const { transfers } = get();
    return transfers?.filter(transfer => transfer.category?.slug === categorySlug) || [];
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    transfers: [], 
    loading: false, 
    error: null, 
    lastFetched: null,
    fetchPromise: null
  }),
}));

export default useTransferStore;
