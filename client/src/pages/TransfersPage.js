import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProductStore, useCategoryStore } from '../stores';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Custom CSS for Swiper pagination
const swiperStyles = `
  .testimonials-swiper .swiper-pagination-bullet {
    background: #d1d5db;
    opacity: 0.5;
  }
  .testimonials-swiper .swiper-pagination-bullet-active {
    background: #2563eb;
    opacity: 1;
  }
  .testimonials-swiper .swiper-pagination {
    bottom: -40px;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = swiperStyles;
  document.head.appendChild(styleSheet);
}

const TransfersPage = () => {
  const { t, i18n } = useTranslation();
  const { products, fetchProducts, loading, error } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Filter and search products (only Transfer Services)
  const filteredProducts = products.filter(product => {
    // Only show Transfer Services products
    const isTransferService = product.category?.type === 'transfer-services';
    
    const matchesSearch = product.title?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.shortDescription?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category?.slug === selectedCategory;
    const matchesVehicleType = !selectedVehicleType || product.category?.vehicleType === selectedVehicleType;
    const matchesSeats = !selectedSeats || product.category?.seats === parseInt(selectedSeats);
    
    const matchesPrice = product.pricing?.adult >= priceRange[0] && product.pricing?.adult <= priceRange[1];
    
    return isTransferService && matchesSearch && matchesCategory && matchesVehicleType && matchesSeats && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title?.[i18n.language]?.localeCompare(b.title?.[i18n.language]) || 0;
      case 'price-low':
        return (a.pricing?.adult || 0) - (b.pricing?.adult || 0);
      case 'price-high':
        return (b.pricing?.adult || 0) - (a.pricing?.adult || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (duration) => {
    if (!duration) return 'Flexible';
    if (duration <= 1) return `${duration} hour`;
    return `${duration} hours`;
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading transfers</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('transfers.title')}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('transfers.subtitle')}
        </p>
      </div>

             {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
            
            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for way"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Transfer Type */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Transfer Type</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Array.from(new Set(categories
                  .filter(cat => cat.type === 'transfer-services' && cat.vehicleType)
                  .map(cat => cat.vehicleType)))
                  .map(vehicleType => (
                    <label key={vehicleType} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedVehicleType === vehicleType}
                        onChange={(e) => setSelectedVehicleType(e.target.checked ? vehicleType : '')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{vehicleType}</span>
                    </label>
                  ))}
              </div>
            </div>

            {/* Seats */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Seats</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Array.from(new Set(categories
                  .filter(cat => cat.type === 'transfer-services' && cat.seats)
                  .map(cat => cat.seats)))
                  .sort((a, b) => a - b)
                  .map(seats => (
                    <label key={seats} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSeats === seats.toString()}
                        onChange={(e) => setSelectedSeats(e.target.checked ? seats.toString() : '')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {seats === 9 ? 'LIMO 9 seat' : 
                         seats === 4 ? '4-seats' :
                         seats === 16 ? '16-seats' :
                         seats === 7 ? '7-seats' :
                         seats === 45 ? '45 seat' :
                         `${seats}-seats`}
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000000])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Clear All */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedVehicleType('');
                setSelectedSeats('');
                setPriceRange([0, 1000]);
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Header with Results Count and Sort */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-blue-600 font-medium">
              {sortedProducts.length} options
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Transfers List */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <FunnelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers found</h3>
              <p className="text-gray-600">Try adjusting your filters to find more options.</p>
            </div>
          ) : (
                        <div className="space-y-4">
                       {sortedProducts.map((transfer) => (
               <div key={transfer._id} className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {transfer.title?.[i18n.language] || transfer.title?.en || 'Transfer Service'}
                    </h3>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>👤</span>
                        <span>
                          {transfer.category?.seats === 9 ? '9 seat' : 
                           transfer.category?.seats === 4 ? '4-seats' :
                           transfer.category?.seats === 16 ? '16-seats' :
                           transfer.category?.seats === 7 ? '7-seats' :
                           transfer.category?.seats === 45 ? '45 seat' :
                           transfer.category?.seats ? `${transfer.category.seats}-seats` : 'Flexible'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>📄</span>
                        <span>{transfer.category?.vehicleType || 'Private Car'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Price</div>
                    <div className="text-xl font-bold text-gray-900 mb-2">
                      ${transfer.pricing?.adult || 0}
                    </div>
                                         <Link
                       to={`/transfer/${transfer.slug}`}
                       className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                     >
                      Book
                      <svg className="w-4 h-4 ml-1 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Transfer Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Airport to City Center', price: '250,000', duration: '45 min' },
            { name: 'City Center to Airport', price: '250,000', duration: '45 min' },
            { name: 'Hotel to Tourist Sites', price: '150,000', duration: '30 min' },
            { name: 'Inter-city Transfer', price: '500,000', duration: '2 hours' }
          ].map((route, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 mb-2">{route.name}</h3>
              <p className="text-blue-600 font-semibold mb-1">{route.price} VND</p>
              <p className="text-sm text-gray-600">{route.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Transfer Services?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Punctual Service</h3>
            <p className="text-gray-600">We guarantee on-time pickups and drop-offs for all our transfers.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Professional Drivers</h3>
            <p className="text-gray-600">Experienced and licensed drivers with excellent safety records.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CurrencyDollarIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Competitive Pricing</h3>
            <p className="text-gray-600">Transparent pricing with no hidden fees or surprises.</p>
          </div>
                 </div>
       </div>
     </div>
   );
 };

export default TransfersPage;

