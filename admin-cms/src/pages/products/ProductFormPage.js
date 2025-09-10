import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTourStore, useTransferStore, useTourCategoryStore, useTransferCategoryStore } from '../../stores';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/common/ImageUpload';


const ProductFormPage = () => {
  const { t } = useTranslation();
  const { id, type } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { tours, fetchTours, createTour, updateTour, getTourById } = useTourStore();
  const { transfers, fetchTransfers, createTransfer, updateTransfer, getTransferById } = useTransferStore();
  const { categories: tourCategories, fetchCategories: fetchTourCategories } = useTourCategoryStore();
  const { categories: transferCategories, fetchCategories: fetchTransferCategories } = useTransferCategoryStore();

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
      nights: '',
      minutes: '' // For transfers
    },
    location: {
      en: '',
      vi: ''
    },
    // Transfer specific fields
    from: {
      en: '',
      vi: ''
    },
    to: {
      en: '',
      vi: ''
    },
    route: '',
    distance: '',
    vehicleType: '',
    seats: '',
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

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchTourCategories();
    fetchTransferCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id, fetchTourCategories, fetchTransferCategories]);

  // Get current categories based on type
  const categories = type === 'vietnam-tours' ? tourCategories : transferCategories;
  const filteredCategories = categories || [];
  
  // Auto-select first category of the specified type
  useEffect(() => {
    if (filteredCategories.length > 0 && !isEditing && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: filteredCategories[0]._id
      }));
    }
  }, [filteredCategories, isEditing, formData.category]);

  const fetchProduct = async () => {
    try {
      setInitialLoading(true);
      let product;
      
      console.log('Fetching product with ID:', id, 'Type:', type);
      
      if (type === 'vietnam-tours') {
        product = getTourById(id);
        console.log('Initial tour product:', product);
        if (!product) {
          console.log('Tour not found, fetching tours...');
          await fetchTours();
          product = getTourById(id);
          console.log('Tour after fetch:', product);
        }
      } else {
        product = getTransferById(id);
        console.log('Initial transfer product:', product);
        if (!product) {
          console.log('Transfer not found, fetching transfers...');
          await fetchTransfers();
          product = getTransferById(id);
          console.log('Transfer after fetch:', product);
        }
      }
      
      console.log('Final product:', product);
      
      if (!product) {
        throw new Error(`Product not found with ID: ${id}`);
      }
      
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
          nights: product.duration?.nights || '',
          minutes: product.duration || '' // For transfers
        },
        location: {
          en: product.location?.en || '',
          vi: product.location?.vi || ''
        },
        // Transfer specific fields
        from: {
          en: product.from?.en || '',
          vi: product.from?.vi || ''
        },
        to: {
          en: product.to?.en || '',
          vi: product.to?.vi || ''
        },
        route: product.route || '',
        distance: product.distance || '',
        vehicleType: product.vehicleType || '',
        seats: product.seats || '',
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

    // Clear validation error when user starts typing
    if (lang) {
      setValidationErrors(prev => ({
        ...prev,
        [`${field}_${lang}`]: null
      }));
    } else {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
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
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Client-side validation
    const errors = [];

    // Title validation
    if (!formData.title.en.trim()) {
      errors.push('English title is required');
      setValidationErrors(prev => ({ ...prev, title_en: 'English title is required' }));
    }
    if (!formData.title.vi.trim()) {
      errors.push('Vietnamese title is required');
      setValidationErrors(prev => ({ ...prev, title_vi: 'Vietnamese title is required' }));
    }

    // Description validation
    if (!formData.description.en.trim()) {
      errors.push('English description is required');
      setValidationErrors(prev => ({ ...prev, description_en: 'English description is required' }));
    }
    if (!formData.description.vi.trim()) {
      errors.push('Vietnamese description is required');
      setValidationErrors(prev => ({ ...prev, description_vi: 'Vietnamese description is required' }));
    }

    // Short description validation
    if (!formData.shortDescription.en.trim()) {
      errors.push('English short description is required');
      setValidationErrors(prev => ({ ...prev, shortDescription_en: 'English short description is required' }));
    }
    if (!formData.shortDescription.vi.trim()) {
      errors.push('Vietnamese short description is required');
      setValidationErrors(prev => ({ ...prev, shortDescription_vi: 'Vietnamese short description is required' }));
    }

    // Category validation
    if (!formData.category) {
      errors.push('Category is required');
      setValidationErrors(prev => ({ ...prev, category: 'Category is required' }));
    }

    // Pricing validation
    if (!formData.pricing.adult || parseFloat(formData.pricing.adult) <= 0) {
      errors.push('Adult price must be greater than 0');
      setValidationErrors(prev => ({ ...prev, pricing: 'Adult price must be greater than 0' }));
    }

    // Duration validation
    if (type === 'vietnam-tours') {
      if (!formData.duration.days || parseInt(formData.duration.days) <= 0) {
        errors.push('Duration days must be greater than 0');
        setValidationErrors(prev => ({ ...prev, duration: 'Duration days must be greater than 0' }));
      }
    } else {
      // For transfers, validate minutes
      if (!formData.duration.minutes || parseInt(formData.duration.minutes) <= 0) {
        errors.push('Duration minutes must be greater than 0');
        setValidationErrors(prev => ({ ...prev, duration: 'Duration minutes must be greater than 0' }));
      }
    }

    // Location validation
    if (!formData.location.en.trim()) {
      errors.push('English location is required');
      setValidationErrors(prev => ({ ...prev, location_en: 'English location is required' }));
    }
    if (!formData.location.vi.trim()) {
      errors.push('Vietnamese location is required');
      setValidationErrors(prev => ({ ...prev, location_vi: 'Vietnamese location is required' }));
    }

    // Images validation
    if (!formData.images || formData.images.length === 0) {
      errors.push('At least one image is required');
      setValidationErrors(prev => ({ ...prev, images: 'At least one image is required' }));
    }

    // Requirements validation - OPTIONAL
    // if (!formData.requirements.en.trim()) {
    //   errors.push('English requirements are required');
    //   setValidationErrors(prev => ({ ...prev, requirements_en: 'English requirements are required' }));
    // }
    // if (!formData.requirements.vi.trim()) {
    //   errors.push('Vietnamese requirements are required');
    //   setValidationErrors(prev => ({ ...prev, requirements_vi: 'Vietnamese requirements are required' }));
    // }

    // Cancellation policy validation - OPTIONAL
    // if (!formData.cancellationPolicy.en.trim()) {
    //   errors.push('English cancellation policy is required');
    //   setValidationErrors(prev => ({ ...prev, cancellationPolicy_en: 'English cancellation policy is required' }));
    // }
    // if (!formData.cancellationPolicy.vi.trim()) {
    //   errors.push('Vietnamese cancellation policy is required');
    //   setValidationErrors(prev => ({ ...prev, cancellationPolicy_vi: 'Vietnamese cancellation policy is required' }));
    // }

    // Tour specific validations - OPTIONAL
    if (type === 'vietnam-tours') {
      // Highlights validation - OPTIONAL
      // if (!formData.highlights || formData.highlights.length === 0) {
      //   errors.push('At least one highlight is required');
      //   setValidationErrors(prev => ({ ...prev, highlights: 'At least one highlight is required' }));
      // }

      // Included validation - OPTIONAL
      // if (!formData.included || formData.included.length === 0) {
      //   errors.push('At least one included item is required');
      //   setValidationErrors(prev => ({ ...prev, included: 'At least one included item is required' }));
      // }

      // Excluded validation - OPTIONAL
      // if (!formData.excluded || formData.excluded.length === 0) {
      //   errors.push('At least one excluded item is required');
      //   setValidationErrors(prev => ({ ...prev, excluded: 'At least one excluded item is required' }));
      // }
    }

    // Show all validation errors
    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error);
      });
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
        }
      };

      // Handle duration based on type
      if (type === 'vietnam-tours') {
        submitData.duration = {
          days: formData.duration.days ? parseInt(formData.duration.days) : undefined,
          nights: formData.duration.nights ? parseInt(formData.duration.nights) : undefined
        };
      } else {
        // For transfers, use minutes as duration
        submitData.duration = formData.duration.minutes ? parseInt(formData.duration.minutes) : undefined;
      }

      // Add transfer specific fields
      if (type === 'transfer-services') {
        submitData.from = formData.from;
        submitData.to = formData.to;
        submitData.route = formData.route;
        submitData.distance = formData.distance ? parseInt(formData.distance) : undefined;
        submitData.vehicleType = formData.vehicleType;
        submitData.seats = formData.seats ? parseInt(formData.seats) : undefined;
      }

      // Only include tour-specific fields for tours
      if (type === 'vietnam-tours') {
        submitData.highlights = formData.highlights;
        submitData.included = formData.included;
        submitData.excluded = formData.excluded;
      } else {
        // Remove tour-specific fields for transfers
        delete submitData.highlights;
        delete submitData.included;
        delete submitData.excluded;
      }

      if (isEditing) {
        if (type === 'vietnam-tours') {
          await updateTour(id, submitData);
        } else {
          await updateTransfer(id, submitData);
        }
        toast.success(t('products.updateSuccess'));
      } else {
        if (type === 'vietnam-tours') {
          await createTour(submitData);
        } else {
          await createTransfer(submitData);
        }
        toast.success(t('products.createSuccess'));
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Handle server validation errors
      if (error.response?.data?.errors) {
        // Handle array of validation errors
        const serverErrors = error.response.data.errors;
        if (Array.isArray(serverErrors)) {
          serverErrors.forEach(err => {
            toast.error(err.msg || err.message || 'Validation error');
          });
        } else {
          // Handle object of validation errors
          Object.values(serverErrors).forEach(err => {
            toast.error(err);
          });
        }
      } else if (error.response?.data?.message) {
        // Handle single error message
        toast.error(error.response.data.message);
      } else {
        // Handle network or other errors
        toast.error('Failed to save product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field, value, lang = null) => {
    const fieldKey = lang ? `${field}_${lang}` : field;
    
    if (lang) {
      if (!value.trim()) {
        setValidationErrors(prev => ({
          ...prev,
          [fieldKey]: `${field} is required`
        }));
        return false;
      }
    } else {
      if (field === 'category' && !value) {
        setValidationErrors(prev => ({
          ...prev,
          [fieldKey]: 'Category is required'
        }));
        return false;
      }
      if (field === 'pricing' && (!value.adult || parseFloat(value.adult) <= 0)) {
        setValidationErrors(prev => ({
          ...prev,
          [fieldKey]: 'Adult price must be greater than 0'
        }));
        return false;
      }
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [fieldKey]: null
    }));
    return true;
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
              {filteredCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name.en}
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
          {type === 'vietnam-tours' ? (
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
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.duration.minutes}
                onChange={(e) => handleNestedInputChange('duration', 'minutes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Duration in minutes"
                required
              />
            </div>
          )}

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

          {/* Transfer Specific Fields */}
          {type === 'transfer-services' && (
            <>
              {/* From/To */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.from.en}
                    onChange={(e) => handleInputChange('from', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Hanoi Airport"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From (Vietnamese) *
                  </label>
                  <input
                    type="text"
                    value={formData.from.vi}
                    onChange={(e) => handleInputChange('from', e.target.value, 'vi')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Sân bay Hà Nội"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.to.en}
                    onChange={(e) => handleInputChange('to', e.target.value, 'en')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Old Quarter"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To (Vietnamese) *
                  </label>
                  <input
                    type="text"
                    value={formData.to.vi}
                    onChange={(e) => handleInputChange('to', e.target.value, 'vi')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Phố Cổ"
                    required
                  />
                </div>
              </div>

              {/* Route, Distance, Vehicle Type, Seats */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Route
                  </label>
                  <input
                    type="text"
                    value={formData.route}
                    onChange={(e) => handleInputChange('route', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Hanoi-Sapa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.distance}
                    onChange={(e) => handleInputChange('distance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Distance in kilometers"
                  />
                </div>
              </div>

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
                    <option value="">Select Vehicle Type</option>
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="bus">Bus</option>
                    <option value="limousine">Limousine</option>
                    <option value="motorbike">Motorbike</option>
                    <option value="train">Train</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.seats}
                    onChange={(e) => handleInputChange('seats', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Number of seats"
                  />
                </div>
              </div>
            </>
          )}

          {/* Highlights - Only for tours */}
          {type === 'vietnam-tours' && (
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
          )}

          {/* Included - Only for tours */}
          {type === 'vietnam-tours' && (
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
          )}

          {/* Excluded - Only for tours */}
          {type === 'vietnam-tours' && (
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
          )}

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
