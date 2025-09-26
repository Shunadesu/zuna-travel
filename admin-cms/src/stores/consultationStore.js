import { create } from 'zustand';
import apiClient from '../utils/apiConfig';

const useConsultationStore = create((set, get) => ({
  // State
  consultations: [],
  consultation: null,
  stats: null,
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all consultations with caching
  fetchConsultations: async (forceRefresh = false, params = {}) => {
    const { consultations, lastFetched, cacheExpiry } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && consultations.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return consultations;
    }

    set({ loading: true, error: null });

    try {
      const response = await apiClient.get('/consultations', { params });
      const fetchedConsultations = response.data.data;
      
      set({ 
        consultations: fetchedConsultations, 
        lastFetched: now,
        loading: false 
      });

      return fetchedConsultations;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch consultations',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch single consultation
  fetchConsultation: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get(`/consultations/${id}`);
      const consultation = response.data.data;
      
      set({ consultation, loading: false });
      return consultation;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch consultation',
        loading: false 
      });
      throw error;
    }
  },

  // Update consultation status
  updateConsultationStatus: async (id, statusData) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.put(`/consultations/${id}/status`, statusData);
      const updatedConsultation = response.data.data;
      
      // Update in local state
      set(state => ({
        consultations: state.consultations.map(consultation => 
          consultation._id === id ? updatedConsultation : consultation
        ),
        consultation: updatedConsultation,
        loading: false
      }));

      return updatedConsultation;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update consultation status',
        loading: false 
      });
      throw error;
    }
  },

  // Add contact history
  addContactHistory: async (id, contactData) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.post(`/consultations/${id}/contact`, contactData);
      const updatedConsultation = response.data.data;
      
      // Update in local state
      set(state => ({
        consultations: state.consultations.map(consultation => 
          consultation._id === id ? updatedConsultation : consultation
        ),
        consultation: updatedConsultation,
        loading: false
      }));

      return updatedConsultation;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to add contact history',
        loading: false 
      });
      throw error;
    }
  },

  // Delete consultation
  deleteConsultation: async (id) => {
    set({ loading: true, error: null });

    try {
      await apiClient.delete(`/consultations/${id}`);
      
      // Remove from local state
      set(state => ({
        consultations: state.consultations.filter(consultation => consultation._id !== id),
        consultation: state.consultation?._id === id ? null : state.consultation,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete consultation',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch consultation statistics
  fetchStats: async () => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get('/consultations/stats/overview');
      const stats = response.data.data;
      
      set({ stats, loading: false });
      return stats;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch consultation stats',
        loading: false 
      });
      throw error;
    }
  },

  // Get consultation by ID from local state
  getConsultationById: (id) => {
    const { consultations } = get();
    return consultations.find(consultation => consultation._id === id);
  },

  // Get consultations by status
  getConsultationsByStatus: (status) => {
    const { consultations } = get();
    return consultations.filter(consultation => consultation.status === status);
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    consultations: [], 
    consultation: null,
    stats: null,
    loading: false, 
    error: null, 
    lastFetched: null 
  }),
}));

export default useConsultationStore;
