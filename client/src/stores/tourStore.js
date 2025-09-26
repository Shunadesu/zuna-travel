import { create } from 'zustand';
import apiClient from '../utils/apiUtils';

const useTourStore = create((set, get) => ({
  // State
  tours: [],
  featuredTours: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 20 * 60 * 1000, // 20 minutes
  fetchPromise: null, // To prevent multiple simultaneous requests
  fetchFeaturedPromise: null, // To prevent multiple simultaneous requests

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

    // Only set loading if we don't have any data yet
    if (tours.length === 0) {
      set({ loading: true, error: null });
    }

    const fetchToursPromise = (async () => {
      try {
        const response = await apiClient.get('/tours');
        console.log('Tours API Response:', response.data);
        const fetchedTours = response.data.data || response.data;
        
        set({ 
          tours: fetchedTours, 
          lastFetched: now,
          loading: false,
          fetchPromise: null
        });

        return fetchedTours;
      } catch (error) {
        console.error('Tours API Error:', error);
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

  // Fetch featured tours
  fetchFeaturedTours: async (forceRefresh = false) => {
    const { featuredTours, lastFetched, cacheExpiry, fetchFeaturedPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && featuredTours.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return featuredTours;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchFeaturedPromise) {
      return fetchFeaturedPromise;
    }

    // Only set loading if we don't have any data yet
    if (featuredTours.length === 0) {
      set({ loading: true, error: null });
    }

    const fetchFeaturedToursPromise = (async () => {
      try {
        const response = await apiClient.get('/tours?featured=true');
        const fetchedTours = response.data.data;
        
        set({ 
          featuredTours: fetchedTours, 
          lastFetched: now,
          loading: false,
          fetchFeaturedPromise: null
        });

        return fetchedTours;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch featured tours',
          loading: false,
          fetchFeaturedPromise: null
        });
        throw error;
      }
    })();

    set({ fetchFeaturedPromise: fetchFeaturedToursPromise });
    return fetchFeaturedToursPromise;
  },

  // Get tour by slug
  getTourBySlug: (slug) => {
    const { tours } = get();
    return tours.find(tour => tour.slug === slug);
  },

  // Fetch tour by slug from API
  fetchTourBySlug: async (slug) => {
    try {
      set({ loading: true, error: null });
      const response = await apiClient.get(`/tours/slug/${slug}`);
      const tour = response.data.data;
      
      // Update tours array with the fetched tour
      const { tours } = get();
      const existingIndex = tours.findIndex(t => t._id === tour._id);
      
      if (existingIndex >= 0) {
        // Update existing tour
        const updatedTours = [...tours];
        updatedTours[existingIndex] = tour;
        set({ tours: updatedTours, loading: false });
      } else {
        // Add new tour to the array
        set({ tours: [...tours, tour], loading: false });
      }
      
      return tour;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch tour',
        loading: false
      });
      throw error;
    }
  },

  // Get tours by category
  getToursByCategory: (categorySlug) => {
    const { tours } = get();
    return tours?.filter(tour => tour.category?.slug === categorySlug) || [];
  },

  // Get active tours
  getActiveTours: () => {
    const { tours } = get();
    return tours?.filter(tour => tour.isActive) || [];
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    tours: [], 
    featuredTours: [],
    loading: false, 
    error: null, 
    lastFetched: null,
    fetchPromise: null,
    fetchFeaturedPromise: null
  }),
}));

export default useTourStore;
