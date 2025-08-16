import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, PencilIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import apiClient from '../../utils/apiConfig';
import toast from 'react-hot-toast';

const BlogDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/blogs/${id}`);
      setBlog(response.data.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const categoryOptions = {
      'travel-tips': t('blogs.categoryOptions.travel-tips'),
      'destinations': t('blogs.categoryOptions.destinations'),
      'food-culture': t('blogs.categoryOptions.food-culture'),
      'news': t('blogs.categoryOptions.news'),
      'guides': t('blogs.categoryOptions.guides')
    };
    return categoryOptions[category] || category;
  };

  const getCategoryBadgeClass = (category) => {
    const badgeClasses = {
      'travel-tips': 'bg-blue-100 text-blue-800',
      'destinations': 'bg-green-100 text-green-800',
      'food-culture': 'bg-yellow-100 text-yellow-800',
      'news': 'bg-red-100 text-red-800',
      'guides': 'bg-purple-100 text-purple-800'
    };
    return badgeClasses[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Blog not found</h3>
        <p className="mt-1 text-sm text-gray-500">The blog you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link
            to="/admin/blogs"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/blogs"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Blogs
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Blog Details</h1>
          <Link
            to={`/admin/blogs/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Blog
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Blog Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16">
              {blog.featuredImage?.url ? (
                <img
                  className="h-16 w-16 rounded-lg object-cover"
                  src={blog.featuredImage.url}
                  alt={blog.title.en}
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {blog.title.en}
              </h2>
              <p className="text-sm text-gray-500">{blog.title.vi}</p>
              <div className="mt-2 flex items-center space-x-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  blog.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {blog.isPublished ? t('common.published') : t('common.draft')}
                </span>
                {blog.isFeatured && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {t('blogs.isFeatured')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Details */}
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">English Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{blog.title.en}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Vietnamese Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{blog.title.vi}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Slug</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{blog.slug}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Author</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {blog.author?.firstName} {blog.author?.lastName}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Views</dt>
              <dd className="mt-1 text-sm text-gray-900">{blog.views || 0}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Reading Time</dt>
              <dd className="mt-1 text-sm text-gray-900">{blog.readingTime || 5} minutes</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Published At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Not published yet'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Categories</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <div className="flex flex-wrap gap-2">
                  {blog.categories?.map((category, index) => (
                    <span
                      key={index}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeClass(category)}`}
                    >
                      {getCategoryLabel(category)}
                    </span>
                  ))}
                </div>
              </dd>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Tags</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                      >
                        {tag.en} / {tag.vi}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            )}

            {blog.excerpt?.en && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Excerpt (EN)</dt>
                <dd className="mt-1 text-sm text-gray-900">{blog.excerpt.en}</dd>
              </div>
            )}

            {blog.excerpt?.vi && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Excerpt (VI)</dt>
                <dd className="mt-1 text-sm text-gray-900">{blog.excerpt.vi}</dd>
              </div>
            )}

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">English Content</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {blog.content?.en}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Vietnamese Content</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {blog.content?.vi}
              </dd>
            </div>

            {blog.relatedPosts && blog.relatedPosts.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Related Posts</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="space-y-1">
                    {blog.relatedPosts.map((post, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span>•</span>
                        <span>{post.title?.en}</span>
                        <span className="text-gray-500">({post.slug})</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(blog.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Blog ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{blog._id}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
