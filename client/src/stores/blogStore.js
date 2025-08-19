import { create } from 'zustand';
import apiClient from '../utils/apiUtils';

const useBlogStore = create((set, get) => ({
  blogs: [],
  featuredBlogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 20 * 60 * 1000, // 20 minutes
  fetchPromise: null,

  // Fetch all blogs
  fetchBlogs: async (forceRefresh = false, params = {}) => {
    const { blogs, lastFetched, cacheExpiry, fetchPromise } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && blogs.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return blogs;
    }

    // If there's already a fetch in progress, return that promise
    if (fetchPromise) {
      return fetchPromise;
    }

    // Only set loading if we don't have any data yet
    if (blogs.length === 0) {
      set({ loading: true, error: null });
    }

    const fetchBlogsPromise = (async () => {
      try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/blogs?${queryString}` : '/blogs';
        const response = await apiClient.get(url);
        
        set({ 
          blogs: response.data.data || response.data,
          lastFetched: now,
          loading: false,
          fetchPromise: null
        });
        
        return response.data;
      } catch (error) {
        console.error('Error fetching blogs:', error);
        set({ 
          error: error.response?.data?.message || 'Failed to fetch blogs',
          loading: false,
          fetchPromise: null
        });
        throw error;
      }
    })();

    set({ fetchPromise: fetchBlogsPromise });
    return fetchBlogsPromise;
  },

  // Fetch featured blogs
  fetchFeaturedBlogs: async (forceRefresh = false, params = {}) => {
    const { featuredBlogs, lastFetched, cacheExpiry } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && featuredBlogs.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return featuredBlogs;
    }

    try {
      // Only set loading if we don't have any data yet
      if (featuredBlogs.length === 0) {
        set({ loading: true, error: null });
      }
      
      const queryString = new URLSearchParams({ ...params, featured: 'true' }).toString();
      const response = await apiClient.get(`/blogs?${queryString}`);
      
      set({ 
        featuredBlogs: response.data.data || response.data,
        lastFetched: now,
        loading: false 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch featured blogs',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch blog by slug
  fetchBlogBySlug: async (slug) => {
    try {
      set({ loading: true, error: null });
      
      const response = await apiClient.get(`/blogs/slug/${slug}`);
      const blogData = response.data.data || response.data;
      
      set({ 
        currentBlog: blogData,
        loading: false 
      });
      
      return blogData;
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch blog',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch blogs by category
  fetchBlogsByCategory: async (category, params = {}) => {
    try {
      set({ loading: true, error: null });
      
      const queryString = new URLSearchParams({ ...params, category }).toString();
      const response = await apiClient.get(`/blogs?${queryString}`);
      const blogsData = response.data.data || response.data;
      
      set({ 
        blogs: blogsData,
        loading: false 
      });
      
      return blogsData;
    } catch (error) {
      console.error('Error fetching blogs by category:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch blogs by category',
        loading: false 
      });
      throw error;
    }
  },

  // Search blogs
  searchBlogs: async (query, params = {}) => {
    try {
      set({ loading: true, error: null });
      
      const queryString = new URLSearchParams({ ...params, search: query }).toString();
      const response = await apiClient.get(`/blogs?${queryString}`);
      
      set({ 
        blogs: response.data.data || response.data,
        loading: false 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching blogs:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to search blogs',
        loading: false 
      });
      throw error;
    }
  },

  // Clear current blog
  clearCurrentBlog: () => {
    set({ currentBlog: null });
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset store
  reset: () => {
    set({
      blogs: [],
      featuredBlogs: [],
      currentBlog: null,
      loading: false,
      error: null,
      lastFetched: null,
      fetchPromise: null
    });
  }
}));

export default useBlogStore;
