import { create } from 'zustand';
import apiClient from '../utils/apiUtils';

const useProductStore = create((set, get) => ({
  // State
  products: [],
  featuredProducts: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 10 * 60 * 1000, // 10 minutes
  fetchPromise: null, // To prevent multiple simultaneous requests
  fetchFeaturedPromise: null, // To prevent multiple simultaneous requests

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all products
  fetchProducts: async (forceRefresh = false) => {
    const { products, lastFetched, cacheExpiry, fetchPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && products.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return products;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchPromise) {
      return fetchPromise;
    }

    set({ loading: true, error: null });

    const fetchProductsPromise = (async () => {
      try {
        const response = await apiClient.get('/products');
        const fetchedProducts = response.data.data;
        
        set({ 
          products: fetchedProducts, 
          lastFetched: now,
          loading: false,
          fetchPromise: null
        });

        return fetchedProducts;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch products',
          loading: false,
          fetchPromise: null
        });
        throw error;
      }
    })();

    set({ fetchPromise: fetchProductsPromise });
    return fetchProductsPromise;
  },

  // Fetch featured products
  fetchFeaturedProducts: async (forceRefresh = false) => {
    const { featuredProducts, lastFetched, cacheExpiry, fetchFeaturedPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && featuredProducts.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return featuredProducts;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchFeaturedPromise) {
      return fetchFeaturedPromise;
    }

    set({ loading: true, error: null });

    const fetchFeaturedProductsPromise = (async () => {
      try {
        const response = await apiClient.get('/products?featured=true');
        const fetchedProducts = response.data.data;
        
        set({ 
          featuredProducts: fetchedProducts, 
          lastFetched: now,
          loading: false,
          fetchFeaturedPromise: null
        });

        return fetchedProducts;
      } catch (error) {
        set({ 
          error: error.response?.data?.message || 'Failed to fetch featured products',
          loading: false,
          fetchFeaturedPromise: null
        });
        throw error;
      }
    })();

    set({ fetchFeaturedPromise: fetchFeaturedProductsPromise });
    return fetchFeaturedProductsPromise;
  },

  // Get product by slug
  getProductBySlug: (slug) => {
    const { products } = get();
    return products.find(product => product.slug === slug);
  },

  // Get products by category
  getProductsByCategory: (categorySlug) => {
    const { products } = get();
    return products?.filter(product => product.category?.slug === categorySlug) || [];
  },

  // Get active products
  getActiveProducts: () => {
    const { products } = get();
    return products?.filter(product => product.isActive) || [];
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    products: [], 
    featuredProducts: [],
    loading: false, 
    error: null, 
    lastFetched: null,
    fetchPromise: null,
    fetchFeaturedPromise: null
  }),
}));

export default useProductStore;

