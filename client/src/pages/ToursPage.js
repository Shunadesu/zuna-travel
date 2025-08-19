import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { useProductStore, useCategoryStore, useSettingsStore } from '../stores';
import CategoryTabs from '../components/tours/CategoryTabs';

const ToursPage = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { products, fetchProducts, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { settings, fetchSettings } = useSettingsStore();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(slug || '');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [duration, setDuration] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSettings();
  }, [fetchProducts, fetchCategories]); // Remove fetchSettings from dependencies

  useEffect(() => {
    if (slug) {
      setSelectedCategory(slug);
    }
  }, [slug]);

  // Filter and search products (only Vietnam Tours)
  const filteredProducts = products?.filter(product => {
    // Only show Vietnam Tours products
    // Check if category is populated object or just slug string
    const isVietnamTour = product.category?.type === 'vietnam-tours' || 
                         (typeof product.category === 'string' && categories?.find(cat => cat.slug === product.category)?.type === 'vietnam-tours');
    
    const matchesSearch = product.title?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.shortDescription?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
                           product.category?.slug === selectedCategory || 
                           (typeof product.category === 'string' && product.category === selectedCategory);
    
    const matchesPrice = product.pricing?.adult >= priceRange[0] && product.pricing?.adult <= priceRange[1];
    
    const matchesDuration = !duration || product.duration?.days === parseInt(duration);
    
    return isVietnamTour && matchesSearch && matchesCategory && matchesPrice && matchesDuration;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.title?.[i18n.language] || '').localeCompare(b.title?.[i18n.language] || '');
      case 'price-low':
        return (a.pricing?.adult || 0) - (b.pricing?.adult || 0);
      case 'price-high':
        return (b.pricing?.adult || 0) - (a.pricing?.adult || 0);
      case 'duration':
        return (a.duration?.days || 0) - (b.duration?.days || 0);
      default:
        return 0;
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newSearchParams.set('search', searchTerm);
    } else {
      newSearchParams.delete('search');
    }
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setDuration('');
    setSortBy('name');
    setSearchParams({});
  };

  const activeCategories = categories?.filter(cat => cat.isActive && cat.type === 'vietnam-tours') || [];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {slug ? categories.find(cat => cat.slug === slug)?.name?.[i18n.language] || 'Category' : t('tours.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {slug ? categories.find(cat => cat.slug === slug)?.description?.[i18n.language] || 'No description available' : t('tours.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  {t('tours.filters')}
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {t('tours.clearAll')}
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('tours.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </form>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">{t('tours.categories')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{t('tours.allCategories')}</span>
                  </label>
                  
                  {/* Categories */}
                  {activeCategories.map((category) => (
                    <label key={category._id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.slug}
                        checked={selectedCategory === category.slug}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name?.[i18n.language] || category.name?.en || 'Category'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">{t('tours.priceRange')}</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">{t('tours.duration')}</h3>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('tours.anyDuration')}</option>
                  <option value="1">1 {t('tours.day')}</option>
                  <option value="2">2 {t('tours.days')}</option>
                  <option value="3">3 {t('tours.days')}</option>
                  <option value="4">4 {t('tours.days')}</option>
                  <option value="5">5 {t('tours.days')}</option>
                  <option value="6">6 {t('tours.days')}</option>
                  <option value="7">7+ {t('tours.days')}</option>
                </select>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">{t('tours.sortBy')}</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">{t('tours.name')}</option>
                  <option value="price-low">{t('tours.priceLow')}</option>
                  <option value="price-high">{t('tours.priceHigh')}</option>
                  <option value="duration">{t('tours.duration')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('tours.showing')} {sortedProducts.length} {t('tours.of')} {filteredProducts.length} {t('tours.tours')}
                </h2>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('tours.noResults')}</h3>
                <p className="text-gray-600">{t('tours.noResultsDesc')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/tour/${product.slug}`}
                    className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {product.images && product.images.length > 0 ? (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={product.images[0].url}
                          alt={product.title?.[i18n.language] || product.title?.en || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.isFeatured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                            {t('tours.featured')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
                        <div className="text-white text-4xl font-bold">
                          {(product.title?.[i18n.language] || product.title?.en || 'P').charAt(0)}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="text-xs text-blue-600 font-medium mb-1">
                        {product.category?.name?.[i18n.language] || product.category?.name?.en || 'Category'}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {product.title?.[i18n.language] || product.title?.en || 'Product'}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-gray-500 text-sm">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {product.duration?.days || product.duration || 'Flexible'} {t('tours.days')}
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <StarIcon className="h-3 w-3 fill-current" />
                          <span className="ml-1 text-xs text-gray-600">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">
                          {product.pricing?.currency || 'USD'} {product.pricing?.adult || '0'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t('common.perPerson')}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToursPage;

