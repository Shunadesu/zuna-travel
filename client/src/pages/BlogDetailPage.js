import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogStore } from '../stores';
import { 
  CalendarIcon,
  UserIcon,
  EyeIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { currentBlog: blog, loading, error, fetchBlogBySlug, fetchBlogsByCategory } = useBlogStore();
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogData = await fetchBlogBySlug(slug);
        // Fetch related blogs if blog has categories
        if (blogData?.categories?.length > 0) {
          await fetchRelatedBlogs(blogData.categories[0]);
        }
      } catch (err) {
        console.error('Error loading blog:', err);
      }
    };
    loadBlog();
  }, [slug, fetchBlogBySlug]);

  const fetchRelatedBlogs = async (category) => {
    if (isLoadingRelated) return; // Prevent duplicate calls
    
    try {
      setIsLoadingRelated(true);
      const result = await fetchBlogsByCategory(category, { limit: 3 });
      if (result && Array.isArray(result)) {
        setRelatedBlogs(result.filter(b => b.slug !== slug));
      } else if (result && result.data && Array.isArray(result.data)) {
        setRelatedBlogs(result.data.filter(b => b.slug !== slug));
      }
    } catch (err) {
      console.error('Error fetching related blogs:', err);
    } finally {
      setIsLoadingRelated(false);
    }
  };

  // Don't show full page loading, just show content with loading states

  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/blog" className="text-gray-700 hover:text-blue-600">
                Blog
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {loading ? (
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              ) : (
                <span className="text-gray-500">{blog?.title?.en || blog?.title}</span>
              )}
            </div>
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <article className="mb-12">
        {/* Featured Image */}
        <div className="mb-8">
          {loading ? (
            <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : (
            <img
              src={blog?.featuredImage?.url || blog?.images?.[0]?.url || 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop'}
              alt={blog?.title?.en || blog?.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Article Meta */}
        <div className="flex items-center justify-between mb-6">
          {loading ? (
            <div className="flex items-center space-x-6">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {formatDate(blog?.createdAt)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <UserIcon className="w-4 h-4 mr-1" />
                {blog?.author?.name || 'Admin'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <EyeIcon className="w-4 h-4 mr-1" />
                {blog?.views || 0} views
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
              } hover:bg-red-500 hover:text-white transition-colors`}
            >
              <HeartIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          {loading ? (
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          ) : (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {blog?.categories?.[0] || 'Travel'}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {loading ? (
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            blog?.title?.en || blog?.title
          )}
        </h1>

        {/* Excerpt */}
                 {blog.excerpt && (
           <div className="mb-8">
             <p className="text-xl text-gray-600 leading-relaxed italic">
               {blog.excerpt?.en || blog.excerpt}
             </p>
           </div>
         )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: blog.content?.en || blog.content || 'No content available.' 
            }}
          />
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <TagIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Tags:</span>
                             {blog.tags.map((tag, index) => (
                 <span
                   key={index}
                   className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                 >
                   {tag?.en || tag}
                 </span>
               ))}
            </div>
          </div>
        )}
      </article>

      {/* Author Bio */}
      <div className="mb-12 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                         <span className="text-white font-bold text-xl">
               {(blog.author?.name || 'A').charAt(0).toUpperCase()}
             </span>
          </div>
          <div>
                         <h3 className="font-semibold text-gray-900">{blog.author?.name || 'Admin'}</h3>
            <p className="text-gray-600">
              Travel enthusiast and writer with years of experience exploring the world. 
              Passionate about sharing travel tips and inspiring others to discover new destinations.
            </p>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((relatedBlog) => (
              <article key={relatedBlog._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video">
                                     <img
                     src={relatedBlog.featuredImage?.url || relatedBlog.images?.[0]?.url || 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop'}
                     alt={relatedBlog.title?.en || relatedBlog.title}
                     className="w-full h-full object-cover"
                   />
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                                         <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                       {relatedBlog.categories?.[0] || 'Travel'}
                     </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(relatedBlog.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedBlog.title?.en || relatedBlog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {truncateText(relatedBlog.content?.en || relatedBlog.content, 100)}
                  </p>
                  <Link
                    to={`/blog/${relatedBlog.slug}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-600 text-center">
            Comments feature coming soon! Share your thoughts and experiences.
          </p>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-blue-50 rounded-lg p-8">
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
    </div>
  );
};

export default BlogDetailPage;

