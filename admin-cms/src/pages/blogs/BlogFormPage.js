import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import apiClient from '../../utils/apiConfig';
import toast from 'react-hot-toast';

const BlogFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const [formData, setFormData] = useState({
    title: {
      en: '',
      vi: ''
    },
    content: {
      en: '',
      vi: ''
    },
    excerpt: {
      en: '',
      vi: ''
    },
    categories: [],
    tags: [],
    isPublished: false,
    isFeatured: false
  });

  const [tagInput, setTagInput] = useState({ en: '', vi: '' });

  const categoryOptions = [
    { value: 'travel-tips', label: t('blogs.categoryOptions.travel-tips') },
    { value: 'destinations', label: t('blogs.categoryOptions.destinations') },
    { value: 'food-culture', label: t('blogs.categoryOptions.food-culture') },
    { value: 'news', label: t('blogs.categoryOptions.news') },
    { value: 'guides', label: t('blogs.categoryOptions.guides') }
  ];

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setInitialLoading(true);
      const response = await apiClient.get(`/blogs/${id}`);
      const blog = response.data.data;
      
      setFormData({
        title: {
          en: blog.title?.en || '',
          vi: blog.title?.vi || ''
        },
        content: {
          en: blog.content?.en || '',
          vi: blog.content?.vi || ''
        },
        excerpt: {
          en: blog.excerpt?.en || '',
          vi: blog.excerpt?.vi || ''
        },
        categories: blog.categories || [],
        tags: blog.tags || [],
        isPublished: blog.isPublished || false,
        isFeatured: blog.isFeatured || false
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog');
      navigate('/admin/blogs');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field, value, lang = null) => {
    setFormData(prev => {
      if (lang) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [lang]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const addTag = () => {
    if (tagInput.en.trim() || tagInput.vi.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, { ...tagInput }]
      }));
      setTagInput({ en: '', vi: '' });
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.en.trim() || !formData.title.vi.trim()) {
      toast.error('Title is required in both languages');
      return;
    }

    if (!formData.content.en.trim() || !formData.content.vi.trim()) {
      toast.error('Content is required in both languages');
      return;
    }

    if (formData.categories.length === 0) {
      toast.error('At least one category is required');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        categories: formData.categories
      };

      if (isEditing) {
        await apiClient.put(`/blogs/${id}`, submitData);
        toast.success(t('blogs.updateSuccess'));
      } else {
        await apiClient.post('/blogs', submitData);
        toast.success(t('blogs.createSuccess'));
      }
      
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? t('blogs.edit') : t('blogs.create')}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blogs.titleEn')} *
              </label>
              <input
                type="text"
                value={formData.title.en}
                onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter English title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blogs.titleVi')} *
              </label>
              <input
                type="text"
                value={formData.title.vi}
                onChange={(e) => handleInputChange('title', e.target.value, 'vi')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Vietnamese title"
                required
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blogs.contentEn')} *
              </label>
              <textarea
                value={formData.content.en}
                onChange={(e) => handleInputChange('content', e.target.value, 'en')}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter English content"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blogs.contentVi')} *
              </label>
              <textarea
                value={formData.content.vi}
                onChange={(e) => handleInputChange('content', e.target.value, 'vi')}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Vietnamese content"
                required
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blogs.excerptEn')}
              </label>
              <textarea
                value={formData.excerpt.en}
                onChange={(e) => handleInputChange('excerpt', e.target.value, 'en')}
                rows={3}
                maxLength={300}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter English excerpt (max 300 characters)"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.excerpt.en.length}/300 characters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blogs.excerptVi')}
              </label>
              <textarea
                value={formData.excerpt.vi}
                onChange={(e) => handleInputChange('excerpt', e.target.value, 'vi')}
                rows={3}
                maxLength={300}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Vietnamese excerpt (max 300 characters)"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.excerpt.vi.length}/300 characters
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blogs.categories')} *
            </label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {categoryOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(option.value)}
                    onChange={() => handleCategoryChange(option.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blogs.tags')}
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                value={tagInput.en}
                onChange={(e) => setTagInput(prev => ({ ...prev, en: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tag in English"
              />
              <input
                type="text"
                value={tagInput.vi}
                onChange={(e) => setTagInput(prev => ({ ...prev, vi: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tag in Vietnamese"
              />
            </div>
            <button
              type="button"
              onClick={addTag}
              className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Tag
            </button>
            {formData.tags.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">
                      {tag.en} / {tag.vi}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blogs.isPublished')}
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {formData.isPublished ? t('common.published') : t('common.draft')}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('blogs.isFeatured')}
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {formData.isFeatured ? t('blogs.isFeatured') : 'Not Featured'}
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              to="/admin/blogs"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('common.cancel')}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEditing ? t('common.update') : t('common.create'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormPage;
