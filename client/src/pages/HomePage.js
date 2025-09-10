import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRightIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  HeartIcon,
  GlobeAltIcon,
  TruckIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { useSettingsStore, useTourCategoryStore, useTransferCategoryStore, useTourStore, useTransferStore } from '../stores';
import HeroSwiper from '../components/home/HeroSwiper';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { settings, fetchSettings, loading: settingsLoading } = useSettingsStore();
  const { categories: tourCategories, fetchCategories: fetchTourCategories, loading: tourCategoriesLoading } = useTourCategoryStore();
  const { categories: transferCategories, fetchCategories: fetchTransferCategories, loading: transferCategoriesLoading } = useTransferCategoryStore();
  const { tours, fetchTours, loading: toursLoading } = useTourStore();
  const { transfers, fetchTransfers, loading: transfersLoading } = useTransferStore();
  const [activeCategoryTab, setActiveCategoryTab] = useState('');

  // Check if any data is still loading
  const isLoading = settingsLoading || tourCategoriesLoading || transferCategoriesLoading || toursLoading || transfersLoading;
  
  // Check if we have any data to show
  const hasData = settings || tourCategories?.length > 0 || transferCategories?.length > 0 || tours?.length > 0 || transfers?.length > 0;

  useEffect(() => {
    // Fetch all data in parallel for better performance
    Promise.all([
      fetchSettings(),
      fetchTourCategories(),
      fetchTransferCategories(),
      fetchTours(),
      fetchTransfers()
    ]).catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [fetchSettings, fetchTourCategories, fetchTransferCategories, fetchTours, fetchTransfers]);

  const activeTourCategories = tourCategories?.filter(cat => cat.isActive) || [];
  const activeTransferCategories = transferCategories?.filter(cat => cat.isActive) || [];
  
  const featuredTours = tours?.filter(tour => tour.isFeatured).slice(0, 6) || [];
  const featuredTransfers = transfers?.filter(transfer => transfer.isFeatured).slice(0, 3) || [];

  // Set default active tab to first category if available
  useEffect(() => {
    if (activeTourCategories.length > 0 && !activeCategoryTab) {
      setActiveCategoryTab(activeTourCategories[0].slug);
    }
  }, [activeTourCategories, activeCategoryTab]);

  // Get tours for the active category tab
  const getToursByCategory = (categorySlug) => {
    return tours?.filter(tour => 
      tour.category?.slug === categorySlug
    ).slice(0, 4) || []; // Show max 4 tours per category
  };

  const stats = [
    { number: '5000+', label: t('home.stats.travelers') },
    { number: '50+', label: t('home.stats.destinations') },
    { number: '98%', label: t('home.stats.satisfaction') },
    { number: '24/7', label: t('home.stats.support') }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'United States',
      rating: 5,
      text: 'Amazing experience! The tour guide was knowledgeable and the itinerary was perfect. Highly recommend!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      location: 'Australia',
      rating: 5,
      text: 'Professional service from start to finish. The transfer was on time and the driver was very friendly.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emma Rodriguez',
      location: 'Spain',
      rating: 5,
      text: 'Beautiful destinations and excellent organization. Will definitely book again for my next Vietnam trip!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const features = [
    {
      icon: ShieldCheckIcon,
      title: t('home.features.safety.title'),
      description: t('home.features.safety.description')
    },
    {
      icon: UsersIcon,
      title: t('home.features.expertise.title'),
      description: t('home.features.expertise.description')
    },
    {
      icon: ClockIcon,
      title: t('home.features.support.title'),
      description: t('home.features.support.description')
    },
    {
      icon: HeartIcon,
      title: t('home.features.experience.title'),
      description: t('home.features.experience.description')
    }
  ];

  return (
    <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSwiper />

        {/* Browse by Location Section */}
        <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-8 leading-tight">
                {t('home.locations.title')}
              </h2>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                {t('home.locations.subtitle')}
              </p>
            </div>

            {/* Location Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
              {isLoading ? (
                // Loading skeleton for location cards
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="relative overflow-hidden rounded-3xl shadow-xl">
                    <div className="w-full h-80 bg-gray-200 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="h-8 bg-white/20 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : (
                activeTourCategories.slice(0, 4).map((category, index) => (
                <Link 
                  key={category._id} 
                  to={`/tours?category=${category.slug}`} 
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-500">
                    {category.images && category.images.length > 0 ? (
                      <img
                        src={category.images[0].url}
                        alt={category.name?.[i18n.language] || category.name?.en || 'Location'}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-white text-6xl font-bold">
                          {(category.name?.[i18n.language] || category.name?.en || 'L').charAt(0)}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className={`absolute ${index % 2 === 0 ? 'bottom-6 left-6 right-6' : 'top-6 left-6 right-6'}`}>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {category.name?.[i18n.language] || category.name?.en || 'Location'}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {category.description?.[i18n.language] || category.description?.en || 'Discover amazing tours in this beautiful location.'}
                      </p>
                    </div>
                    <div className={`absolute ${index % 2 === 0 ? 'top-6 right-6' : 'bottom-6 right-6'}`}>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/30 transition-all duration-300">
                        <ArrowRightIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
              )}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link
                to="/tours"
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full text-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                {t('home.locations.browseButton')}
                <ArrowRightIcon className="h-6 w-6 ml-3 transform rotate-45" />
              </Link>
            </div>
          </div>
        </section>

        {/* Tour Categories Tabs Section */}
      {(isLoading || activeTourCategories.length > 0) && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('home.tourCategories.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('home.tourCategories.subtitle')}
              </p>
            </div>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {isLoading ? (
                // Loading skeleton for category tabs
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-12 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                ))
              ) : (
                activeTourCategories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setActiveCategoryTab(category.slug)}
                  className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                    activeCategoryTab === category.slug
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name?.[i18n.language] || category.name?.en || 'Category'}
                </button>
              ))
              )}
            </div>
            
            {/* Tours Grid for Active Category */}
            {isLoading ? (
              // Loading skeleton for tours grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="flex justify-between mb-3">
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activeCategoryTab && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getToursByCategory(activeCategoryTab).map((tour) => (
                  <Link
                    key={tour._id}
                    to={`/tour/${tour.slug}`}
                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {tour.images && tour.images.length > 0 ? (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={tour.images[0].url}
                          alt={tour.title?.[i18n.language] || tour.title?.en || 'Tour'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {tour.isFeatured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                            {t('home.tourCategories.featured')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
                        <div className="text-white text-4xl font-bold">
                          {(tour.title?.[i18n.language] || tour.title?.en || 'T').charAt(0)}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="text-xs text-blue-600 font-medium mb-1">
                        {tour.category?.name?.[i18n.language] || tour.category?.name?.en || 'Category'}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {tour.title?.[i18n.language] || tour.title?.en || 'Tour'}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-gray-500 text-sm">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {tour.duration?.days || tour.duration || 'Flexible'} {t('home.tourCategories.days')}
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <StarIcon className="h-3 w-3 fill-current" />
                          <span className="ml-1 text-xs text-gray-600">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">
                          {tour.pricing?.currency || 'USD'} {tour.pricing?.adult || '0'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t('home.tourCategories.perPerson')}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* View All Button */}
            <div className="text-center mt-8">
              <Link
                to="/tours"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                {t('home.tourCategories.viewAll')}
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Tours Section */}
      {(isLoading || featuredTours.length > 0) && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('home.featuredTours.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('home.featuredTours.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                // Loading skeleton for featured tours
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="flex justify-between mb-3">
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                featuredTours.map((tour) => (
                <Link
                  key={tour._id}
                  to={`/tour/${tour.slug}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {tour.images && tour.images.length > 0 ? (
                    <div className="h-64 overflow-hidden relative">
                      <img
                        src={tour.images[0].url}
                        alt={tour.title?.[i18n.language] || tour.title?.en || 'Tour'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {tour.isFeatured && (
                        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                          {t('home.featuredTours.featured')}
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                        ⭐ 4.8
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
                      <div className="text-white text-6xl font-bold">
                        {(tour.title?.[i18n.language] || tour.title?.en || 'T').charAt(0)}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {tour.title?.[i18n.language] || tour.title?.en || 'Tour'}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {tour.shortDescription?.[i18n.language] || tour.shortDescription?.en || tour.description?.[i18n.language] || tour.description?.en || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {tour.location?.[i18n.language] || tour.location?.en || tour.category?.location?.[i18n.language] || tour.category?.location?.en || 'Location'}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {tour.duration?.days || tour.duration || 'Flexible'} {t('home.featuredTours.days')}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        {tour.pricing?.currency || 'USD'} {tour.pricing?.adult || '0'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('home.featuredTours.perPerson')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/tours"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                {t('home.featuredTours.viewAll')}
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Transfer Services Section */}
      {(isLoading || featuredTransfers.length > 0) && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('home.transfers.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('home.transfers.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading ? (
                // Loading skeleton for transfer services
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="group bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                featuredTransfers.map((transfer) => (
                <Link
                  key={transfer._id}
                  to={`/transfer/${transfer.slug}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {transfer.images && transfer.images.length > 0 ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={transfer.images[0].url}
                        alt={transfer.title?.[i18n.language] || transfer.title?.en || 'Transfer'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                      <TruckIcon className="w-16 h-16 text-white" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {transfer.title?.[i18n.language] || transfer.title?.en || 'Transfer'}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {transfer.shortDescription?.[i18n.language] || transfer.shortDescription?.en || transfer.description?.[i18n.language] || transfer.description?.en || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-blue-600">
                        {transfer.pricing?.currency || 'USD'} {transfer.pricing?.adult || '0'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('home.transfers.perTrip')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link
                to="/transfers"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-full text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
              >
                {t('home.transfers.viewAll')}
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tours"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              {t('home.cta.browseTours')}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              {t('home.cta.contactUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
