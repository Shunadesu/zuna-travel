import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/common/ImageUpload';
import { useTourCategoryStore, useTransferCategoryStore } from '../../stores';

const CategoryFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;
  const categoryType = searchParams.get('type') || 'vietnam-tours';

  const [formData, setFormData] = useState({
    name: {
      en: '',
      vi: ''
    },
    description: {
      en: '',
      vi: ''
    },
    type: categoryType,
    slug: '',
    order: 0,
    featured: false,
    isActive: true,
    images: [],
    location: {
      en: '',
      vi: ''
    },
    vehicleType: '',
    seats: '',
    region: '',
    duration: '',
    difficulty: '',
    highlights: [],
    amenities: [],
    features: []
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  
  // Tour categories store
  const {
    category: tourCategory,
    loading: tourLoading,
    error: tourError,
    fetchCategory: fetchTourCategory,
    createCategory: createTourCategory,
    updateCategory: updateTourCategory,
    clearError: clearTourError
  } = useTourCategoryStore();

  // Transfer categories store
  const {
    category: transferCategory,
    loading: transferLoading,
    error: transferError,
    fetchCategory: fetchTransferCategory,
    createCategory: createTransferCategory,
    updateCategory: updateTransferCategory,
    clearError: clearTransferError
  } = useTransferCategoryStore();

  // Get current store based on type
  const currentStore = categoryType === 'vietnam-tours' ? {
    category: tourCategory,
    loading: tourLoading,
    error: tourError,
    fetchCategory: fetchTourCategory,
    createCategory: createTourCategory,
    updateCategory: updateTourCategory,
    clearError: clearTourError
  } : {
    category: transferCategory,
    loading: transferLoading,
    error: transferError,
    fetchCategory: fetchTransferCategory,
    createCategory: createTransferCategory,
    updateCategory: updateTransferCategory,
    clearError: clearTransferError
  };

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [id, isEditing, categoryType]);

  useEffect(() => {
    if (currentStore.error) {
      toast.error(currentStore.error);
      currentStore.clearError();
    }
  }, [currentStore.error, currentStore.clearError]);

  const fetchCategory = async () => {
    try {
      setInitialLoading(true);
      const categoryData = await currentStore.fetchCategory(id);
      
      setFormData({
        name: categoryData.name || { en: '', vi: '' },
        description: categoryData.description || { en: '', vi: '' },
        type: categoryData.type || categoryType,
        slug: categoryData.slug || '',
        order: categoryData.order || 0,
        featured: categoryData.featured || false,
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
        images: categoryData.images || [],
        location: categoryData.location || { en: '', vi: '' },
        vehicleType: categoryData.vehicleType || '',
        seats: categoryData.seats || '',
        region: categoryData.region || '',
        duration: categoryData.duration || '',
        difficulty: categoryData.difficulty || '',
        highlights: categoryData.highlights || [],
        amenities: categoryData.amenities || [],
        features: categoryData.features || []
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category');
      navigate(`/admin/categories?tab=${categoryType}`);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.en.trim()) {
      toast.error('English name is required');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name.en)
      };

      // Only include vehicleType if type is transfer-services
      if (formData.type !== 'transfer-services') {
        delete submitData.vehicleType;
        delete submitData.seats;
      }

      if (isEditing) {
        await currentStore.updateCategory(id, submitData);
        toast.success(t('categories.updateSuccess'));
      } else {
        await currentStore.createCategory(submitData);
        toast.success(t('categories.createSuccess'));
      }
      
      navigate(`/admin/categories?tab=${categoryType}`);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
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
          to="/admin/categories"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Categories
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? t('categories.edit') : t('categories.create')}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categories.nameEn')} *
              </label>
              <input
                type="text"
                value={formData.name.en}
                onChange={(e) => handleInputChange('name', e.target.value, 'en')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter English name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categories.nameVi')}
              </label>
              <input
                type="text"
                value={formData.name.vi}
                onChange={(e) => handleInputChange('name', e.target.value, 'vi')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên tiếng Việt"
              />
            </div>
          </div>

          {/* Description Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categories.descriptionEn')}
              </label>
              <textarea
                value={formData.description.en}
                onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter English description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categories.descriptionVi')}
              </label>
              <textarea
                value={formData.description.vi}
                onChange={(e) => handleInputChange('description', e.target.value, 'vi')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mô tả tiếng Việt"
              />
            </div>
          </div>

          {/* Type and Slug */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categories.type')}
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="vietnam-tours">{t('categories.vietnamTours')}</option>
                <option value="transfer-services">{t('categories.transferServices')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categories.slug')}
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="auto-generated-slug"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to auto-generate from English name
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (English)
              </label>
              <input
                type="text"
                value={formData.location.en}
                onChange={(e) => handleInputChange('location', e.target.value, 'en')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Hanoi, Vietnam"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Vietnamese)
              </label>
              <input
                type="text"
                value={formData.location.vi}
                onChange={(e) => handleInputChange('location', e.target.value, 'vi')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Hà Nội, Việt Nam"
              />
            </div>
          </div>

          {/* Transfer Service Fields - Only show for transfer-services type */}
          {formData.type === 'transfer-services' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select vehicle type</option>
                  <option value="Luxury LIMO">Luxury LIMO</option>
                  <option value="Sharing Bus">Sharing Bus</option>
                  <option value="Private">Private</option>
                  <option value="Shuttle Bus">Shuttle Bus</option>
                  <option value="Private car/Private LIMO">Private car/Private LIMO</option>
                  <option value="LIMO">LIMO</option>
                  <option value="Sleeping Bus">Sleeping Bus</option>
                  <option value="Private car">Private car</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats
                </label>
                <input
                  type="number"
                  value={formData.seats}
                  onChange={(e) => handleInputChange('seats', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 4, 9, 16, 45"
                  min="1"
                  max="100"
                />
              </div>
            </div>
          )}

          {/* Images */}
          <div>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleInputChange('images', images)}
              maxImages={5}
              folder="zuna-travel/categories"
              label="Category Images"
            />
          </div>

          {/* Sort Order and Status */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categories.sortOrder')}
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categories.isActive')}
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
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              to="/admin/categories"
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

export default CategoryFormPage;
