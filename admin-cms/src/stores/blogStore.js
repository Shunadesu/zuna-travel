import { create } from 'zustand';
import { useApi } from '../contexts/ApiContext';

const useBlogStore = create((set, get) => ({
  // State
  blogs: [],
  blog: null,
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all blogs with caching
  fetchBlogs: async (forceRefresh = false) => {
    const { blogs, lastFetched, cacheExpiry } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && blogs.length > 0 && lastFetched && (now - lastFetched) < cacheExpiry) {
      return blogs;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.get('/api/blogs');
      const fetchedBlogs = response.data.data;
      
      set({ 
        blogs: fetchedBlogs, 
        lastFetched: now,
        loading: false 
      });

      return fetchedBlogs;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch blogs',
        loading: false 
      });
      throw error;
    }
  },

  // Fetch single blog
  fetchBlog: async (id) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(`/api/blogs/${id}`);
      const blog = response.data.data;
      
      set({ blog, loading: false });
      return blog;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch blog',
        loading: false 
      });
      throw error;
    }
  },

  // Create blog
  createBlog: async (blogData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post('/api/blogs', blogData);
      const newBlog = response.data.data;
      
      // Add to local state
      set(state => ({
        blogs: [...state.blogs, newBlog],
        loading: false
      }));

      return newBlog;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create blog',
        loading: false 
      });
      throw error;
    }
  },

  // Update blog
  updateBlog: async (id, updateData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.put(`/api/blogs/${id}`, updateData);
      const updatedBlog = response.data.data;
      
      // Update in local state
      set(state => ({
        blogs: state.blogs.map(blog => 
          blog._id === id ? updatedBlog : blog
        ),
        blog: updatedBlog,
        loading: false
      }));

      return updatedBlog;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update blog',
        loading: false 
      });
      throw error;
    }
  },

  // Delete blog
  deleteBlog: async (id) => {
    set({ loading: true, error: null });

    try {
      await axios.delete(`/api/blogs/${id}`);
      
      // Remove from local state
      set(state => ({
        blogs: state.blogs.filter(blog => blog._id !== id),
        blog: state.blog?._id === id ? null : state.blog,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete blog',
        loading: false 
      });
      throw error;
    }
  },

  // Get featured blogs
  fetchFeaturedBlogs: async (limit = 5) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(`/api/blogs/featured/list?limit=${limit}`);
      const featuredBlogs = response.data.data;
      
      set({ loading: false });
      return featuredBlogs;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch featured blogs',
        loading: false 
      });
      throw error;
    }
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({ 
    blogs: [], 
    blog: null, 
    loading: false, 
    error: null, 
    lastFetched: null 
  }),
}));

export default useBlogStore;

