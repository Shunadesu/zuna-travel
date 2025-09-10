import { create } from 'zustand';
import apiClient from '../utils/apiConfig';

const useDashboardStore = create((set, get) => ({
  // State
  stats: {
    totalCategories: 0,
    totalProducts: 0,
    totalBlogs: 0,
    totalUsers: 0,
    totalTours: 0,
    totalTransfers: 0,
    totalTourCategories: 0,
    totalTransferCategories: 0
  },
  recentActivities: [],
  featuredProducts: [],
  featuredBlogs: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheExpiry: 2 * 60 * 1000, // 2 minutes for dashboard data

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch dashboard data
  fetchDashboardData: async (forceRefresh = false) => {
    const { lastFetched, cacheExpiry } = get();
    const now = Date.now();

    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && lastFetched && (now - lastFetched) < cacheExpiry) {
      return;
    }

    set({ loading: true, error: null });

    try {
      // Fetch all data in parallel
      const [tourCategoriesRes, transferCategoriesRes, toursRes, transfersRes, blogsRes, usersRes, featuredToursRes, featuredTransfersRes, featuredBlogsRes] = await Promise.all([
        apiClient.get('/tour-categories'),
        apiClient.get('/transfer-categories'),
        apiClient.get('/tours'),
        apiClient.get('/transfers'),
        apiClient.get('/blogs'),
        apiClient.get('/users'),
        apiClient.get('/tours/featured/list?limit=3'),
        apiClient.get('/transfers/featured/list?limit=2'),
        apiClient.get('/blogs/featured/list?limit=5')
      ]);

      const allProducts = [...(toursRes.data.data || []), ...(transfersRes.data.data || [])];
      const allCategories = [...(tourCategoriesRes.data.data || []), ...(transferCategoriesRes.data.data || [])];
      
      const stats = {
        totalCategories: allCategories.length,
        totalProducts: allProducts.length,
        totalBlogs: blogsRes.data.data?.length || 0,
        totalUsers: usersRes.data.data?.length || 0,
        totalTours: toursRes.data.data?.length || 0,
        totalTransfers: transfersRes.data.data?.length || 0,
        totalTourCategories: tourCategoriesRes.data.data?.length || 0,
        totalTransferCategories: transferCategoriesRes.data.data?.length || 0
      };

      // Generate recent activities from the data
      const recentActivities = generateRecentActivities(
        allCategories,
        allProducts,
        blogsRes.data.data
      );

      // Combine featured tours and transfers
      const featuredProducts = [
        ...(featuredToursRes.data.data || []),
        ...(featuredTransfersRes.data.data || [])
      ];

      set({
        stats,
        recentActivities,
        featuredProducts,
        featuredBlogs: featuredBlogsRes.data.data || [],
        lastFetched: now,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch dashboard data',
        loading: false
      });
      throw error;
    }
  },

  // Clear cache
  clearCache: () => set({ lastFetched: null }),

  // Reset store
  reset: () => set({
    stats: {
      totalCategories: 0,
      totalProducts: 0,
      totalBlogs: 0,
      totalUsers: 0,
      totalTours: 0,
      totalTransfers: 0,
      totalTourCategories: 0,
      totalTransferCategories: 0
    },
    recentActivities: [],
    featuredProducts: [],
    featuredBlogs: [],
    loading: false,
    error: null,
    lastFetched: null
  }),
}));

// Helper function to generate recent activities
const generateRecentActivities = (categories, products, blogs) => {
  const activities = [];

  // Add recent products
  if (products && products.length > 0) {
    const recentProducts = products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    
    recentProducts.forEach(product => {
      activities.push({
        id: `product-${product._id}`,
        type: 'product',
        title: `New product added: "${product.title?.en || product.title}"`,
        timestamp: new Date(product.createdAt),
        color: 'bg-green-400'
      });
    });
  }

  // Add recent categories
  if (categories && categories.length > 0) {
    const recentCategories = categories
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    
    recentCategories.forEach(category => {
      activities.push({
        id: `category-${category._id}`,
        type: 'category',
        title: `Category created: "${category.name?.en || category.name}"`,
        timestamp: new Date(category.createdAt),
        color: 'bg-blue-400'
      });
    });
  }

  // Add recent blogs
  if (blogs && blogs.length > 0) {
    const recentBlogs = blogs
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    
    recentBlogs.forEach(blog => {
      activities.push({
        id: `blog-${blog._id}`,
        type: 'blog',
        title: `New blog post: "${blog.title?.en || blog.title}"`,
        timestamp: new Date(blog.createdAt),
        color: 'bg-purple-400'
      });
    });
  }

  // Sort all activities by timestamp and return top 5
  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
    .map(activity => ({
      ...activity,
      timeAgo: getTimeAgo(activity.timestamp)
    }));
};

// Helper function to get time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export default useDashboardStore;







