import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import apiClient from '../../utils/apiConfig';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/common/ImageUpload';


const ProductFormPage = () => {
  const { t } = useTranslation();
  const { id, type } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const [formData, setFormData] = useState({
    title: {
      en: '',
      vi: ''
    },
    description: {
      en: '',
      vi: ''
    },
    shortDescription: {
      en: '',
      vi: ''
    },
    category: '',
    pricing: {
      adult: '',
      child: '',
      currency: 'USD'
    },
    duration: {
      days: '',
      nights: ''
    },
    location: {
      en: '',
      vi: ''
    },
    highlights: [],
    included: [],
    excluded: [],
    requirements: {
      en: '',
      vi: ''
    },
    cancellationPolicy: {
      en: '',
      vi: ''
    },
    images: [],
    isActive: true,
    isFeatured: false
  });

  const [highlightInput, setHighlightInput] = useState({ en: '', vi: '' });
  const [includedInput, setIncludedInput] = useState({ en: '', vi: '' });
  const [excludedInput, setExcludedInput] = useState({ en: '', vi: '' });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      const allCategories = response.data.data || [];
      
      // If type is specified, filter categories by type
      if (type) {
        const filteredCategories = allCategories.filter(cat => cat.type === type);
        setCategories(filteredCategories);
        
        // Auto-select first category of the specified type
        if (filteredCategories.length > 0 && !isEditing) {
          setFormData(prev => ({
            ...prev,
            category: filteredCategories[0]._id
          }));
        }
      } else {
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProduct = async () => {
    try {
      setInitialLoading(true);
      const response = await apiClient.get(`/products/${id}`);
      const product = response.data.data;
      
      setFormData({
        title: {
          en: product.title?.en || '',
          vi: product.title?.vi || ''
        },
        description: {
          en: product.description?.en || '',
          vi: product.description?.vi || ''
        },
        shortDescription: {
          en: product.shortDescription?.en || '',
          vi: product.shortDescription?.vi || ''
        },
        category: product.category?._id || '',
        pricing: {
          adult: product.pricing?.adult || '',
          child: product.pricing?.child || '',
          currency: product.pricing?.currency || 'USD'
        },
        duration: {
          days: product.duration?.days || '',
          nights: product.duration?.nights || ''
        },
        location: {
          en: product.location?.en || '',
          vi: product.location?.vi || ''
        },
        highlights: product.highlights || [],
        included: product.included || [],
        excluded: product.excluded || [],
        requirements: {
          en: product.requirements?.en || '',
          vi: product.requirements?.vi || ''
        },
        cancellationPolicy: {
          en: product.cancellationPolicy?.en || '',
          vi: product.cancellationPolicy?.vi || ''
        },
        images: product.images || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/admin/products');
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

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addHighlight = () => {
    if (highlightInput.en.trim() || highlightInput.vi.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, { ...highlightInput }]
      }));
      setHighlightInput({ en: '', vi: '' });
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addIncluded = () => {
    if (includedInput.en.trim() || includedInput.vi.trim()) {
      setFormData(prev => ({
        ...prev,
        included: [...prev.included, { ...includedInput }]
      }));
      setIncludedInput({ en: '', vi: '' });
    }
  };

  const removeIncluded = (index) => {
    setFormData(prev => ({
      ...prev,
      included: prev.included.filter((_, i) => i !== index)
    }));
  };

  const addExcluded = () => {
    if (excludedInput.en.trim() || excludedInput.vi.trim()) {
      setFormData(prev => ({
        ...prev,
        excluded: [...prev.excluded, { ...excludedInput }]
      }));
      setExcludedInput({ en: '', vi: '' });
    }
  };

  const removeExcluded = (index) => {
    setFormData(prev => ({
      ...prev,
      excluded: prev.excluded.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.en.trim() || !formData.title.vi.trim()) {
      toast.error('Title is required in both languages');
      return;
    }

    if (!formData.description.en.trim() || !formData.description.vi.trim()) {
      toast.error('Description is required in both languages');
      return;
    }

    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        pricing: {
          ...formData.pricing,
          adult: formData.pricing.adult ? parseFloat(formData.pricing.adult) : undefined,
          child: formData.pricing.child ? parseFloat(formData.pricing.child) : undefined
        },
        duration: {
          ...formData.duration,
          days: formData.duration.days ? parseInt(formData.duration.days) : undefined,
          nights: formData.duration.nights ? parseInt(formData.duration.nights) : undefined
        }
      };

      if (isEditing) {
        await apiClient.put(`/products/${id}`, submitData);
        toast.success(t('products.updateSuccess'));
      } else {
        await apiClient.post('/products', submitData);
        toast.success(t('products.createSuccess'));
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
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
          to="/admin/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? t('products.edit') : t('products.create')}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.titleEn')} *
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
                {t('products.titleVi')} *
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

          {/* Description */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.descriptionEn')} *
              </label>
              <textarea
                value={formData.description.en}
                onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter English description"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.descriptionVi')} *
              </label>
              <textarea
                value={formData.description.vi}
                onChange={(e) => handleInputChange('description', e.target.value, 'vi')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Vietnamese description"
                required
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.shortDescriptionEn')}
              </label>
              <textarea
                value={formData.shortDescription.en}
                onChange={(e) => handleInputChange('shortDescription', e.target.value, 'en')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter short English description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.shortDescriptionVi')}
              </label>
              <textarea
                value={formData.shortDescription.vi}
                onChange={(e) => handleInputChange('shortDescription', e.target.value, 'vi')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter short Vietnamese description"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.category')} *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name.en} ({category.type})
                </option>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.adultPrice')}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.pricing.adult}
                onChange={(e) => handleNestedInputChange('pricing', 'adult', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.childPrice')}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.pricing.child}
                onChange={(e) => handleNestedInputChange('pricing', 'child', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.currency')}
              </label>
              <select
                value={formData.pricing.currency}
                onChange={(e) => handleNestedInputChange('pricing', 'currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="VND">VND</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.days')}
              </label>
              <input
                type="number"
                min="1"
                value={formData.duration.days}
                onChange={(e) => handleNestedInputChange('duration', 'days', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Number of days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.nights')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.duration.nights}
                onChange={(e) => handleNestedInputChange('duration', 'nights', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Number of nights"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.locationEn')}
              </label>
              <input
                type="text"
                value={formData.location.en}
                onChange={(e) => handleInputChange('location', e.target.value, 'en')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.locationVi')}
              </label>
              <input
                type="text"
                value={formData.location.vi}
                onChange={(e) => handleInputChange('location', e.target.value, 'vi')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location in Vietnamese"
              />
            </div>
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.highlights')}
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                value={highlightInput.en}
                onChange={(e) => setHighlightInput(prev => ({ ...prev, en: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Highlight in English"
              />
              <input
                type="text"
                value={highlightInput.vi}
                onChange={(e) => setHighlightInput(prev => ({ ...prev, vi: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Highlight in Vietnamese"
              />
            </div>
            <button
              type="button"
              onClick={addHighlight}
              className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Highlight
            </button>
            {formData.highlights.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">
                      {highlight.en} / {highlight.vi}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Included */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.included')}
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                value={includedInput.en}
                onChange={(e) => setIncludedInput(prev => ({ ...prev, en: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Included item in English"
              />
              <input
                type="text"
                value={includedInput.vi}
                onChange={(e) => setIncludedInput(prev => ({ ...prev, vi: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Included item in Vietnamese"
              />
            </div>
            <button
              type="button"
              onClick={addIncluded}
              className="mt-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Included Item
            </button>
            {formData.included.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.included.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm">
                      {item.en} / {item.vi}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeIncluded(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Excluded */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.excluded')}
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                value={excludedInput.en}
                onChange={(e) => setExcludedInput(prev => ({ ...prev, en: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Excluded item in English"
              />
              <input
                type="text"
                value={excludedInput.vi}
                onChange={(e) => setExcludedInput(prev => ({ ...prev, vi: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Excluded item in Vietnamese"
              />
            </div>
            <button
              type="button"
              onClick={addExcluded}
              className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Add Excluded Item
            </button>
            {formData.excluded.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.excluded.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm">
                      {item.en} / {item.vi}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExcluded(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.requirements')} (EN)
              </label>
              <textarea
                value={formData.requirements.en}
                onChange={(e) => handleInputChange('requirements', e.target.value, 'en')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter requirements in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.requirements')} (VI)
              </label>
              <textarea
                value={formData.requirements.vi}
                onChange={(e) => handleInputChange('requirements', e.target.value, 'vi')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter requirements in Vietnamese"
              />
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.cancellationPolicy')} (EN)
              </label>
              <textarea
                value={formData.cancellationPolicy.en}
                onChange={(e) => handleInputChange('cancellationPolicy', e.target.value, 'en')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter cancellation policy in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.cancellationPolicy')} (VI)
              </label>
              <textarea
                value={formData.cancellationPolicy.vi}
                onChange={(e) => handleInputChange('cancellationPolicy', e.target.value, 'vi')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter cancellation policy in Vietnamese"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleInputChange('images', images)}
              maxImages={10}
              folder="zuna-travel/products"
              label="Product Images"
              required={true}
            />
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.isActive')}
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {formData.isActive ? t('common.active') : t('common.inactive')}
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('products.isFeatured')}
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {formData.isFeatured ? t('products.isFeatured') : 'Not Featured'}
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              to="/admin/products"
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

export default ProductFormPage;
