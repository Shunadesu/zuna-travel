import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import toast from 'react-hot-toast';

const BlogsPage = () => {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blogs');
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('blogs.deleteConfirm'))) {
      return;
    }

    try {
      setDeleteLoading(id);
      await axios.delete(`/api/blogs/${id}`);
      toast.success(t('blogs.deleteSuccess'));
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleTogglePublished = async (id, currentPublished) => {
    try {
      await axios.put(`/api/blogs/${id}`, {
        isPublished: !currentPublished
      });
      toast.success(currentPublished ? 'Blog unpublished' : 'Blog published');
      fetchBlogs();
    } catch (error) {
      console.error('Error toggling blog published status:', error);
      toast.error('Failed to update blog published status');
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await axios.put(`/api/blogs/${id}`, {
        isFeatured: !currentFeatured
      });
      toast.success(currentFeatured ? 'Blog unfeatured' : 'Blog featured');
      fetchBlogs();
    } catch (error) {
      console.error('Error toggling blog featured status:', error);
      toast.error('Failed to update blog featured status');
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('blogs.title')}</h1>
        <Link
          to="/admin/blogs/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {t('blogs.create')}
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {blogs.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mb-4">No blogs found</p>
            <Link
              to="/admin/blogs/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              {t('blogs.create')}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('blogs.titleEn')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('blogs.author')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('blogs.categories')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('blogs.views')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {blog.featuredImage?.url ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={blog.featuredImage.url}
                              alt={blog.title.en}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {blog.title.en}
                          </div>
                          <div className="text-sm text-gray-500">
                            {blog.title.vi}
                          </div>
                          <div className="text-xs text-gray-400">
                            {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {blog.author?.firstName} {blog.author?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {blog.author?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {blog.categories?.map((category, index) => (
                          <span
                            key={index}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadgeClass(category)}`}
                          >
                            {getCategoryLabel(category)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {blog.views || 0} {t('blogs.views')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {blog.readingTime || 5} min read
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleTogglePublished(blog._id, blog.isPublished)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                            blog.isPublished 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {blog.isPublished ? t('common.published') : t('common.draft')}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(blog._id, blog.isFeatured)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                            blog.isFeatured 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {blog.isFeatured ? t('blogs.isFeatured') : 'Not Featured'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/blogs/${blog._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/blogs/${blog._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deleteLoading === blog._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteLoading === blog._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
