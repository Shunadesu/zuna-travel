import { create } from 'zustand';
import apiClient from '../utils/apiConfig';

const useTourCategoryStore = create((set, get) => ({
  // State
  categories: [],
  category: null,
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
  fetchPromise: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all tour categories with caching
  fetchCategories: async (forceRefresh = false) => {
    const { categories, lastFetched, cacheExpiry, fetchPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && categories.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return categories;
    }

    // If already fetching, return the existing promise
    if (fetchPromise) {
      return fetchPromise;
    }

    const promise = (async () => {
      set({ loading: true, error: null });

      try {
        const response = await apiClient.get('/tour-categories');
        const fetchedCategories = response.data.data || response.data;
        
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

    set({ fetchPromise: promise });
    return promise;
  },

  // Fetch single tour category
  fetchCategory: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get(`/tour-categories/${id}`);
      const category = response.data.data || response.data;
      
      set({ category, loading: false });
      return category;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch tour category',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch tour category by slug
  fetchCategoryBySlug: async (slug) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get(`/tour-categories/slug/${slug}`);
      const category = response.data.data || response.data;
      
      set({ category, loading: false });
      return category;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch tour category',
        loading: false 
      });
      throw error;
    }
  },

  // Create tour category
  createCategory: async (categoryData) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.post('/tour-categories', categoryData);
      const newCategory = response.data.data || response.data;
      
      // Add to local state
      set(state => ({
        categories: [...state.categories, newCategory],
        loading: false
      }));

      return newCategory;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create tour category',
        loading: false 
      });
      throw error;
    }
  },

  // Update tour category
  updateCategory: async (id, updateData) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.put(`/tour-categories/${id}`, updateData);
      const updatedCategory = response.data.data || response.data;
      
      // Update in local state
      set(state => ({
        categories: state.categories.map(cat => 
          cat._id === id ? updatedCategory : cat
        ),
        category: updatedCategory,
        loading: false
      }));

      return updatedCategory;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update tour category',
        loading: false 
      });
      throw error;
    }
  },

  // Delete tour category
  deleteCategory: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.delete(`/tour-categories/${id}`);
      
      // Remove from local state
      set(state => ({
        categories: state.categories.filter(cat => cat._id !== id),
        category: state.category?._id === id ? null : state.category,
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete tour category',
        loading: false 
      });
      throw error;
    }
  },

  // Get category by ID from local state
  getCategoryById: (id) => {
    const { categories } = get();
    return categories.find(cat => cat._id === id);
  },

  // Get category by slug from local state
  getCategoryBySlug: (slug) => {
    const { categories } = get();
    return categories.find(cat => cat.slug === slug);
  },

  // Get featured tour categories
  fetchFeaturedCategories: async () => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get('/tour-categories/featured/list');
      const featuredCategories = response.data.data || response.data;
      
      set({ loading: false });
      return featuredCategories;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch featured tour categories',
        loading: false 
      });
      throw error;
    }
  },

  // Get tour categories by region
  fetchCategoriesByRegion: async (region) => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get(`/tour-categories/region/${region}`);
      const categories = response.data.data || response.data;
      
      set({ loading: false });
      return categories;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch tour categories by region',
        loading: false 
      });
      throw error;
    }
  },

  // Get all regions
  fetchRegions: async () => {
    set({ loading: true, error: null });

    try {
      const response = await apiClient.get('/tour-categories/regions');
      const regions = response.data.data || response.data;
      
      set({ loading: false });
      return regions;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch regions',
        loading: false 
      });
      throw error;
    }
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null, fetchPromise: null }),

  // Reset store
  reset: () => set({
    categories: [],
    category: null,
    loading: false,
    error: null,
    lastFetched: null,
    fetchPromise: null
  })
}));

export default useTourCategoryStore;
