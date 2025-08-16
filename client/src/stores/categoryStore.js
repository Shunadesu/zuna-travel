import { create } from 'zustand';
import apiClient from '../utils/apiUtils';

const useCategoryStore = create((set, get) => ({
  // State
  categories: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 15 * 60 * 1000, // 15 minutes
  fetchPromise: null, // To prevent multiple simultaneous requests

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch categories
  fetchCategories: async (forceRefresh = false, options = {}) => {
    const { categories, lastFetched, cacheExpiry, fetchPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && categories.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return categories;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchPromise) {
      return fetchPromise;
    }

    set({ loading: true, error: null });

    const fetchCategoriesPromise = (async () => {
      try {
        const params = new URLSearchParams();
        if (options.type) params.append('type', options.type);
        if (options.active !== undefined) params.append('active', options.active);
        if (options.includeSubcategories) params.append('includeSubcategories', 'true');
        if (options.level !== undefined) params.append('level', options.level);
        if (options.parent) params.append('parent', options.parent);

        const response = await apiClient.get(`/categories?${params.toString()}`);
        const fetchedCategories = response.data.data;
        
        set({ 
          categories: fetchedCategories, 
          lastFetched: now,
          loading: false,
          fetchPromise: null
        });

        return fetchedCategories;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch categories',
          loading: false,
          fetchPromise: null
        });
        throw error;
      }
    })();

    set({ fetchPromise: fetchCategoriesPromise });
    return fetchCategoriesPromise;
  },

  // Fetch categories hierarchy
  fetchCategoriesHierarchy: async (type = 'vietnam-tours') => {
    try {
      const response = await apiClient.get(`/categories/hierarchy/${type}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch categories hierarchy:', error);
      throw error;
    }
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

  // Get main categories (level 0)
  getMainCategories: () => {
    const { categories } = get();
    return categories?.filter(category => category.isActive && category.level === 0) || [];
  },

  // Get subcategories of a parent
  getSubcategories: (parentId) => {
    const { categories } = get();
    return categories?.filter(category => 
      category.isActive && 
      category.parent === parentId
    ) || [];
  },

  // Get categories by level
  getCategoriesByLevel: (level) => {
    const { categories } = get();
    return categories?.filter(category => 
      category.isActive && 
      category.level === level
    ) || [];
  },

  // Get categories by region
  getCategoriesByRegion: (region) => {
    const { categories } = get();
    return categories?.filter(category => 
      category.isActive && 
      (category.region === region || category.region === 'all')
    ) || [];
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

export default useCategoryStore;

