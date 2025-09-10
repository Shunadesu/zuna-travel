import { create } from 'zustand';
import apiClient from '../utils/apiConfig';

const useTourStore = create((set, get) => ({
  // State
  tours: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes for admin
  fetchPromise: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all tours
  fetchTours: async (forceRefresh = false) => {
    const { tours, lastFetched, cacheExpiry, fetchPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && tours.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return tours;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchPromise) {
      return fetchPromise;
    }

    set({ loading: true, error: null });

    const fetchToursPromise = (async () => {
      try {
        const response = await apiClient.get('/tours?populate=category');
        const fetchedTours = response.data.data;
        
        set({ 
          tours: fetchedTours, 
          lastFetched: now,
          loading: false,
          fetchPromise: null
        });

        return fetchedTours;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch tours',
          loading: false,
          fetchPromise: null
        });
        throw error;
      }
    })();

    set({ fetchPromise: fetchToursPromise });
    return fetchToursPromise;
  },

  // Create tour
  createTour: async (tourData) => {
    try {
      const response = await apiClient.post('/tours', tourData);
      const newTour = response.data.data;
      
      // Add to local state
      set(state => ({
        tours: [newTour, ...state.tours]
      }));
      
      return newTour;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create tour' });
      throw error;
    }
  },

  // Update tour
  updateTour: async (id, tourData) => {
    try {
      const response = await apiClient.put(`/tours/${id}`, tourData);
      const updatedTour = response.data.data;
      
      // Update in local state
      set(state => ({
        tours: state.tours.map(tour => 
          tour._id === id ? updatedTour : tour
        )
      }));
      
      return updatedTour;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update tour' });
      throw error;
    }
  },

  // Delete tour
  deleteTour: async (id) => {
    try {
      await apiClient.delete(`/tours/${id}`);
      
      // Remove from local state
      set(state => ({
        tours: state.tours.filter(tour => tour._id !== id)
      }));
      
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete tour' });
      throw error;
    }
  },

  // Get tour by ID
  getTourById: (id) => {
    const { tours } = get();
    return tours.find(tour => tour._id === id);
  },

  // Fetch single tour by ID (from API)
  fetchTourById: async (id) => {
    try {
      const response = await apiClient.get(`/tours/${id}?populate=category`);
      const tour = response.data.data;
      
      if (!tour) {
        throw new Error(`Tour with ID ${id} not found`);
      }
      
      // Add to local state if not already present
      set(state => {
        const existingTour = state.tours.find(t => t._id === id);
        if (!existingTour) {
          return {
            tours: [tour, ...state.tours]
          };
        }
        return state;
      });
      
      return tour;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch tour';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Get tours by category
  getToursByCategory: (categorySlug) => {
    const { tours } = get();
    return tours?.filter(tour => tour.category?.slug === categorySlug) || [];
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    tours: [], 
    loading: false, 
    error: null, 
    lastFetched: null,
    fetchPromise: null
  }),
}));

export default useTourStore;
