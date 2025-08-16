import { create } from 'zustand';
import axios from 'axios';

const useCategoryStore = create((set, get) => ({
  // State
  categories: [],
  category: null,
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all categories with caching
  fetchCategories: async (forceRefresh = false) => {
    const { categories, lastFetched, cacheExpiry } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && categories.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return categories;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get('/api/categories');
      const fetchedCategories = response.data.data;
      
      set({ 
        categories: fetchedCategories, 
        lastFetched: now,
        loading: false 
      });

      return fetchedCategories;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch categories',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch single category
  fetchCategory: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(`/api/categories/${id}`);
      const category = response.data.data;
      
      set({ category, loading: false });
      return category;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch category',
        loading: false 
      });
      throw error;
    }
  },

  // Create category
  createCategory: async (categoryData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post('/api/categories', categoryData);
      const newCategory = response.data.data;
      
      // Add to local state
      set(state => ({
        categories: [...state.categories, newCategory],
        loading: false
      }));

      return newCategory;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create category',
        loading: false 
      });
      throw error;
    }
  },

  // Update category
  updateCategory: async (id, updateData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.put(`/api/categories/${id}`, updateData);
      const updatedCategory = response.data.data;
      
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
        error: error.response?.data?.message || 'Failed to update category',
        loading: false 
      });
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    set({ loading: true, error: null });

    try {
      await axios.delete(`/api/categories/${id}`);
      
      // Remove from local state
      set(state => ({
        categories: state.categories.filter(cat => cat._id !== id),
        category: state.category?._id === id ? null : state.category,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete category',
        loading: false 
      });
      throw error;
    }
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    categories: [], 
    category: null, 
    loading: false, 
    error: null, 
    lastFetched: null 
  }),
}));

export default useCategoryStore;

