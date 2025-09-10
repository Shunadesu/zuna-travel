import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTransferStore, useTransferCategoryStore } from '../stores';
import { 
  ClockIcon, 
  CurrencyDollarIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const TransfersPage = () => {
  const { t, i18n } = useTranslation();
  const { transfers, fetchTransfers, loading, error } = useTransferStore();
  const { categories, fetchCategories } = useTransferCategoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [transfersPerPage] = useState(9);

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by local state, no need for URL params
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedServiceType('');
    setSelectedVehicleType('');
    setSelectedRegion('');
    setPriceRange([0, 200]);
    setSortBy('name');
  };

  useEffect(() => {
    fetchTransfers();
    fetchCategories();
  }, [fetchTransfers, fetchCategories]);



  // Filter and search transfers
  const filteredTransfers = transfers?.filter(transfer => {
    // Since API already filters for transfer-services, we can trust all transfers are valid
    const matchesSearch = !searchTerm || 
                         transfer.title?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.shortDescription?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.description?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by service type
    const matchesServiceType = !selectedServiceType || transfer.category?.serviceType === selectedServiceType;
    
    // Filter by vehicle type
    const matchesVehicleType = !selectedVehicleType || transfer.category?.vehicleType === selectedVehicleType;
    
    // Filter by region
    const matchesRegion = !selectedRegion || transfer.category?.region === selectedRegion;
    
    // Filter by price
    const matchesPrice = (transfer.pricing?.adult || 0) >= priceRange[0] && (transfer.pricing?.adult || 0) <= priceRange[1];
    
    return matchesSearch && matchesServiceType && matchesVehicleType && matchesRegion && matchesPrice;
  }) || [];

  // Sort transfers
  const sortedTransfers = [...filteredTransfers].sort((a, b) => {
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

  // Pagination logic
  const totalTransfers = sortedTransfers.length;
  const totalPages = Math.ceil(totalTransfers / transfersPerPage);
  const startIndex = (currentPage - 1) * transfersPerPage;
  const endIndex = startIndex + transfersPerPage;
  const currentTransfers = sortedTransfers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedServiceType, selectedVehicleType, selectedRegion, priceRange, sortBy]);

  // Don't show full page loading, just show content with loading states

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('transfers.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('transfers.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search transfers..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </form>
              </div>

              {/* Service Types */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Service Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="serviceType"
                      value=""
                      checked={selectedServiceType === ''}
                      onChange={(e) => setSelectedServiceType(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Services</span>
                  </label>
                  
                  {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    ))
                  ) : (
                    <>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="serviceType"
                          value="private"
                          checked={selectedServiceType === 'private'}
                          onChange={(e) => setSelectedServiceType(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">🚗 Private Transfers</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="serviceType"
                          value="shared"
                          checked={selectedServiceType === 'shared'}
                          onChange={(e) => setSelectedServiceType(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">🚌 Shared Transfers</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="serviceType"
                          value="train"
                          checked={selectedServiceType === 'train'}
                          onChange={(e) => setSelectedServiceType(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">🚂 Train Services</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="serviceType"
                          value="special"
                          checked={selectedServiceType === 'special'}
                          onChange={(e) => setSelectedServiceType(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">⭐ Special Services</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Vehicle Type</h3>
                <select
                  value={selectedVehicleType}
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Vehicle Type</option>
                  {loading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    Array.from(new Set(transfers
                      ?.filter(transfer => transfer.category?.vehicleType)
                      .map(transfer => transfer.category.vehicleType) || []))
                      .map(vehicleType => (
                        <option key={vehicleType} value={vehicleType}>
                          {vehicleType === 'car' ? '🚗 Car' :
                           vehicleType === 'van' ? '🚐 Van' :
                           vehicleType === 'bus' ? '🚌 Bus' :
                           vehicleType === 'limousine' ? '🚙 Limousine' :
                           vehicleType === 'motorbike' ? '🏍️ Motorbike' :
                           vehicleType === 'train' ? '🚂 Train' :
                           vehicleType}
                        </option>
                      ))
                  )}
                </select>
              </div>

              {/* Region */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Region</h3>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Regions</option>
                  {loading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    Array.from(new Set(transfers
                      ?.filter(transfer => transfer.category?.region)
                      .map(transfer => transfer.category.region) || []))
                      .map(region => (
                        <option key={region} value={region}>
                          {region === 'north' ? '🏔️ North Vietnam' :
                           region === 'central' ? '🏖️ Central Vietnam' :
                           region === 'south' ? '🌴 South Vietnam' :
                           region === 'all' ? '🇻🇳 All Vietnam' :
                           region}
                        </option>
                      ))
                  )}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
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

              {/* Sort */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
          </div>
        </div>

          {/* Transfers Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              {error && (
                <div className="text-red-600 text-sm mb-2">
                  Error: {error}
                </div>
              )}
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Loading...' : `Showing ${currentTransfers.length} of ${totalTransfers} transfers`}
                </h2>
              </div>
            </div>

            {/* Transfers Grid */}
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
            ) : currentTransfers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers found</h3>
                <p className="text-gray-600">Try adjusting your filters to find more options.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTransfers.map((transfer) => (
                  <Link
                    key={transfer._id}
                    to={`/transfer/${transfer.slug}`}
                    className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {transfer.images && transfer.images.length > 0 ? (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={transfer.images[0].url}
                          alt={transfer.title?.[i18n.language] || transfer.title?.en || 'Transfer Service'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {transfer.isFeatured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                        <div className="text-white text-4xl font-bold">
                          {(transfer.title?.[i18n.language] || transfer.title?.en || 'T').charAt(0)}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="text-xs text-blue-600 font-medium mb-1">
                        {transfer.category?.name?.[i18n.language] || transfer.category?.name?.en || 'Transfer Service'}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {transfer.title?.[i18n.language] || transfer.title?.en || 'Transfer Service'}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-gray-500 text-sm">
                          <span className="mr-1">
                            {transfer.category?.serviceType === 'private' ? '🚗' :
                             transfer.category?.serviceType === 'shared' ? '🚌' :
                             transfer.category?.serviceType === 'train' ? '🚂' :
                             transfer.category?.serviceType === 'special' ? '⭐' : '🚗'}
                          </span>
                          {transfer.category?.serviceType === 'private' ? 'Private' :
                           transfer.category?.serviceType === 'shared' ? 'Shared' :
                           transfer.category?.serviceType === 'train' ? 'Train' :
                           transfer.category?.serviceType === 'special' ? 'Special' :
                           'Transfer'}
                          {transfer.category?.route?.from?.en && transfer.category?.route?.to?.en && (
                            <span className="ml-1 text-xs">
                              ({transfer.category.route.from.en} → {transfer.category.route.to.en})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <StarIcon className="h-3 w-3 fill-current" />
                          <span className="ml-1 text-xs text-gray-600">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">
                          {transfer.pricing?.currency || 'USD'} {transfer.pricing?.adult || '0'}
                        </div>
                        <div className="text-xs text-gray-500">
                          per trip
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!shouldShow) {
                      // Show ellipsis for gaps
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-3 py-2 text-sm text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransfersPage;

