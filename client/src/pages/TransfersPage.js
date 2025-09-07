import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTransferStore } from '../stores';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('name');

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by local state, no need for URL params
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedVehicleType('');
    setSelectedSeats('');
    setPriceRange([0, 1000]);
    setSortBy('name');
  };

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  // Filter and search transfers
  const filteredTransfers = transfers?.filter(transfer => {
    // Since API already filters for transfer-services, we can trust all transfers are valid
    const matchesSearch = !searchTerm || 
                         transfer.title?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.shortDescription?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.description?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by vehicle type (category slug)
    const matchesVehicleType = !selectedVehicleType || transfer.category?.slug === selectedVehicleType;
    
    // Filter by seats
    const matchesSeats = !selectedSeats || transfer.category?.seats === parseInt(selectedSeats);
    
    // Filter by price
    const matchesPrice = (transfer.pricing?.adult || 0) >= priceRange[0] && (transfer.pricing?.adult || 0) <= priceRange[1];
    
    return matchesSearch && matchesVehicleType && matchesSeats && matchesPrice;
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

              {/* Transfer Types */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Transfer Types</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="vehicleType"
                      value=""
                      checked={selectedVehicleType === ''}
                      onChange={(e) => setSelectedVehicleType(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Types</span>
                  </label>
                  
                  {loading ? (
                    // Loading skeleton for transfer types
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    ))
                  ) : (
                    // Get unique categories from transfers
                    Array.from(new Map(transfers
                      ?.filter(transfer => transfer.category?.slug)
                      .map(transfer => [transfer.category.slug, {
                        slug: transfer.category.slug,
                        name: transfer.category.name?.[i18n.language] || transfer.category.name?.en || transfer.category.slug
                      }]) || []).values())
                      .map(vehicleType => (
                      <label key={vehicleType.slug} className="flex items-center">
                        <input
                          type="radio"
                          name="vehicleType"
                          value={vehicleType.slug}
                          checked={selectedVehicleType === vehicleType.slug}
                          onChange={(e) => setSelectedVehicleType(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{vehicleType.name}</span>
                      </label>
                    ))
                    )}
                </div>
              </div>

              {/* Seats */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Seats</h3>
                <select
                  value={selectedSeats}
                  onChange={(e) => setSelectedSeats(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Seats</option>
                  {loading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    Array.from(new Set(transfers
                      ?.filter(transfer => transfer.category?.seats)
                      .map(transfer => transfer.category.seats) || []))
                      .sort((a, b) => a - b)
                      .map(seats => (
                        <option key={seats} value={seats.toString()}>
                          {seats === 40 ? '40-seats (Sleeping Bus)' : 
                           seats === 16 ? '16-seats (Shuttle Bus)' :
                           seats === 4 ? '4-seats (Private Car/LIMO)' :
                           `${seats}-seats`}
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
                  {loading ? 'Loading...' : `Showing ${sortedTransfers.length} of ${filteredTransfers.length} transfers`}
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
            ) : sortedTransfers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers found</h3>
                <p className="text-gray-600">Try adjusting your filters to find more options.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTransfers.map((transfer) => (
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
                          <span className="mr-1">👤</span>
                          {transfer.category?.seats === 40 ? '40-seats (Sleeping Bus)' : 
                           transfer.category?.seats === 16 ? '16-seats (Shuttle Bus)' :
                           transfer.category?.seats === 4 ? '4-seats (Private Car/LIMO)' :
                           transfer.category?.seats ? `${transfer.category.seats}-seats` : 'Flexible'}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransfersPage;

