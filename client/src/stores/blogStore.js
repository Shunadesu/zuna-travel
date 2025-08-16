import { create } from 'zustand';
import api from '../contexts/ApiContext';

const useBlogStore = create((set, get) => ({
  blogs: [],
  featuredBlogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  fetchPromise: null,

  // Fetch all blogs
  fetchBlogs: async (params = {}) => {
    const { fetchPromise } = get();
    
    // Prevent multiple simultaneous requests
    if (fetchPromise) {
      return fetchPromise;
    }

    const promise = (async () => {
      try {
        set({ loading: true, error: null });
        
        const response = await api.blogs.getAll(params);
        
        set({ 
          blogs: response.data.data || response.data,
          loading: false 
        });
        
        return response.data;
      } catch (error) {
        console.error('Error fetching blogs:', error);
        set({ 
          error: error.response?.data?.message || 'Failed to fetch blogs',
          loading: false 
        });
        throw error;
      } finally {
        set({ fetchPromise: null });
      }
    })();

    set({ fetchPromise: promise });
    return promise;
  },

  // Fetch featured blogs
  fetchFeaturedBlogs: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.blogs.getFeatured(params);
      
      set({ 
        featuredBlogs: response.data.data || response.data,
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
      
      const response = await api.blogs.getBySlug(slug);
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
      
      const response = await api.blogs.getByCategory(category, params);
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
      
      const response = await api.blogs.search(query, params);
      
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
      fetchPromise: null
    });
  }
}));

export default useBlogStore;
