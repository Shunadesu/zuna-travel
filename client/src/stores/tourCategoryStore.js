import { create } from 'zustand';
import apiClient from '../utils/apiUtils';

const useTourCategoryStore = create((set, get) => ({
  // State
  categories: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 30 * 60 * 1000, // 30 minutes
  fetchPromise: null, // To prevent multiple simultaneous requests

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch tour categories
  fetchCategories: async (forceRefresh = false, options = {}) => {
    const { categories, lastFetched, cacheExpiry, fetchPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && categories && categories.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return categories;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchPromise) {
      return fetchPromise;
    }

    // Only set loading if we don't have any data yet
    if (!categories || categories.length === 0) {
      set({ loading: true, error: null });
    }

    const fetchCategoriesPromise = (async () => {
      try {
        const params = new URLSearchParams();
        if (options.active !== undefined) params.append('active', options.active);
        if (options.featured !== undefined) params.append('featured', options.featured);

        const response = await apiClient.get(`/tour-categories?${params.toString()}`);
        const fetchedCategories = response.data.data || response.data || [];
        
        set({ 
          categories: fetchedCategories, 
          lastFetched: now,
          loading: false,
          fetchPromise: null
        });

        return fetchedCategories;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch tour categories',
          loading: false,
          fetchPromise: null
        });
        throw error;
      }
    })();

    set({ fetchPromise: fetchCategoriesPromise });
    return fetchCategoriesPromise;
  },

  // Get category by slug
  getCategoryBySlug: (slug) => {
    const { categories } = get();
    return categories?.find(category => category.slug === slug);
  },

  // Get active categories
  getActiveCategories: () => {
    const { categories } = get();
    return categories?.filter(category => category.isActive) || [];
  },

  // Get featured categories
  getFeaturedCategories: () => {
    const { categories } = get();
    return categories?.filter(category => category.isActive && category.isFeatured) || [];
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    categories: [], 
    loading: false, 
    error: null, 
    lastFetched: null,
    fetchPromise: null
  }),
}));

export default useTourCategoryStore;
