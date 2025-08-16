import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogStore } from '../stores';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const BlogPage = () => {
  const { blogs, loading, error, fetchBlogs } = useBlogStore();
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        console.log('Loading blogs...');
        await fetchBlogs();
        console.log('Blogs loaded successfully');
      } catch (err) {
        console.error('Error loading blogs:', err);
      }
    };
    loadBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    let filtered = blogs || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        (blog.title?.en || blog.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.content?.en || blog.content || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.categories?.includes(selectedCategory));
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading blogs</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Travel Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover amazing destinations, travel tips, and insider knowledge from our travel experts. 
          Get inspired for your next adventure!
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="travel-tips">Travel Tips</option>
              <option value="destinations">Destinations</option>
              <option value="culture">Culture</option>
              <option value="food">Food & Dining</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end">
            <p className="text-sm text-gray-600">
              {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </div>

      {/* Featured Blog */}
      {filteredBlogs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Post</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto">
                                 <img
                   src={filteredBlogs[0].featuredImage?.url || filteredBlogs[0].images?.[0]?.url || 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop'}
                   alt={filteredBlogs[0].title?.en || filteredBlogs[0].title}
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-4">
                                     <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                     {filteredBlogs[0].categories?.[0] || 'Travel'}
                   </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {formatDate(filteredBlogs[0].createdAt)}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {filteredBlogs[0].title?.en || filteredBlogs[0].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {truncateText(filteredBlogs[0].content?.en || filteredBlogs[0].content, 200)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-1" />
                      {filteredBlogs[0].author?.name || 'Admin'}
                    </div>
                    <div className="flex items-center">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {filteredBlogs[0].views || 0} views
                    </div>
                  </div>
                  <Link
                    to={`/blog/${filteredBlogs[0].slug}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <FunnelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.slice(1).map((blog) => (
            <article key={blog._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="aspect-video relative">
                <img
                  src={blog.featuredImage?.url || blog.images?.[0]?.url || 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop'}
                  alt={blog.title?.en || blog.title}
                  className="w-full h-full object-cover"
                />
                                 <div className="absolute top-4 left-4">
                   <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                     {blog.categories?.[0] || 'Travel'}
                   </span>
                 </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    {formatDate(blog.createdAt)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon className="w-4 h-4 mr-1" />
                    {blog.author?.name || 'Admin'}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {blog.title?.en || blog.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {truncateText(blog.content?.en || blog.content)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    {blog.views || 0} views
                  </div>
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest travel tips, destination guides, and exclusive offers.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Travel Tips', count: 15, color: 'bg-blue-100 text-blue-800' },
            { name: 'Destinations', count: 23, color: 'bg-green-100 text-green-800' },
            { name: 'Culture', count: 8, color: 'bg-purple-100 text-purple-800' },
            { name: 'Food & Dining', count: 12, color: 'bg-orange-100 text-orange-800' }
          ].map((category, index) => (
            <Link
              key={index}
              to={`/blog?category=${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
              className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${category.color}`}>
                {category.name}
              </div>
              <p className="text-sm text-gray-600">{category.count} posts</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

