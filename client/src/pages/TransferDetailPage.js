import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTransferStore, useBookingStore, useSettingsStore } from '../stores';
import { countries } from '../utils/countries';
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  StarIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const TransferDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const { getTransferBySlug, loading, error } = useTransferStore();
  const { createBooking } = useBookingStore();
  const { settings } = useSettingsStore();
  const [transfer, setTransfer] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedImage] = useState(0);
  const [passengers] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    travelers: 1,
    travelDate: '',
    totalPrice: 0,
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      countryCode: 'VN' // Mặc định là Việt Nam
    },
    specialRequests: ''
  });

  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        setIsInitialLoad(true);
        // Get transfer by slug directly
        const transferData = await getTransferBySlug(slug);
        setTransfer(transferData);
      } catch (error) {
        console.error('Error fetching transfer:', error);
        setTransfer(null);
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchTransfer();
  }, [slug, getTransferBySlug]);

  // Initialize booking data when transfer loads
  useEffect(() => {
    if (transfer) {
      setBookingData(prev => ({
        ...prev,
        totalPrice: getTransferPrice()
      }));
    }
  }, [transfer]);

  if (loading || isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || (!transfer && !isInitialLoad)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('transfers.notFound') || 'Transfer not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('transfers.notFoundDesc') || 'The transfer service you\'re looking for doesn\'t exist.'}
          </p>
          <Link 
            to="/transfers" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {t('transfers.backToTransfers') || 'Back to Transfers'}
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDuration = (duration) => {
    if (!duration) return 'Flexible';
    if (duration <= 1) return `${duration} hour`;
    return `${duration} hours`;
  };

  const getTransferPrice = () => {
    return transfer.pricing?.adult || 0;
  };

  const calculateTotalPrice = () => {
    return getTransferPrice() * passengers;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!bookingData.customerInfo.email || !bookingData.customerInfo.phone || !bookingData.travelDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const bookingPayload = {
        productId: transfer._id,
        productType: 'transfer',
        travelers: bookingData.travelers,
        travelDate: bookingData.travelDate,
        totalPrice: bookingData.totalPrice,
        customerInfo: bookingData.customerInfo,
        transferDetails: {
          name: transfer.title?.en || transfer.title,
          from: transfer.from?.en || transfer.from,
          to: transfer.to?.en || transfer.to,
          duration: transfer.duration || 0,
          vehicleType: transfer.category?.vehicleType,
          serviceType: transfer.category?.serviceType,
          category: transfer.category?.name?.en || transfer.category?.name,
          route: transfer.route,
          distance: transfer.distance,
          pricing: {
            adult: transfer.pricing?.adult,
            child: transfer.pricing?.child,
            currency: transfer.pricing?.currency
          }
        },
        specialRequests: bookingData.specialRequests
      };

      await createBooking(bookingPayload);
      toast.success('Transfer booking submitted successfully!');
      setIsBookingModalOpen(false);
      
      // Reset form
      setBookingData({
        travelers: 1,
        travelDate: '',
        totalPrice: getTransferPrice(),
        customerInfo: {
          name: '',
          email: '',
          phone: '',
          countryCode: 'VN'
        },
        specialRequests: ''
      });
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'travelers') {
      setBookingData(prev => ({
        ...prev,
        travelers: value,
        totalPrice: getTransferPrice() * value
      }));
    } else if (field.startsWith('customerInfo.')) {
      const customerField = field.split('.')[1];
      setBookingData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [customerField]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/transfers" className="text-gray-700 hover:text-blue-600">
                {t('nav.transfers')}
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">
                {transfer.title?.[i18n.language] || transfer.title?.en || transfer.name?.en || transfer.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            {transfer.images && transfer.images.length > 0 ? (
              <div className="relative">
                <img
                  src={transfer.images[selectedImage].url}
                  alt={transfer.title?.[i18n.language] || transfer.title?.en || 'Transfer'}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {transfer.isFeatured && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {t('common.featured')}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center">
                <div className="text-white text-6xl font-bold">
                  {(transfer.title?.[i18n.language] || transfer.title?.en || 'T').charAt(0)}
                </div>
              </div>
            )}
          </div>

          {/* Transfer Details */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {transfer.title?.[i18n.language] || transfer.title?.en || transfer.name?.en || transfer.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-400 mr-4">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="ml-2 text-gray-600">4.8 (24 reviews)</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {transfer.description?.[i18n.language] || transfer.description?.en || transfer.shortDescription?.[i18n.language] || transfer.shortDescription?.en || 'No description available'}
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-700">
                  {transfer.location?.[i18n.language] || transfer.location?.en || transfer.category?.location?.[i18n.language] || transfer.category?.location?.en || 'Location'}
                </span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-700">
                  {formatDuration(transfer.duration?.days || transfer.duration)}
                </span>
              </div>
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-gray-700">
                  {transfer.pricing?.currency || 'USD'} {transfer.pricing?.adult || '0'} {t('transfers.perTrip') || 'per trip'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('transfers.description') || 'Description'}
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-600">
                {transfer.description?.[i18n.language] || transfer.description?.en || transfer.shortDescription?.[i18n.language] || transfer.shortDescription?.en || 'No description available'}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {transfer.pricing?.currency || 'USD'} {transfer.pricing?.adult || '0'}
              </h3>
              <p className="text-gray-600">{t('transfers.perTrip') || 'per trip'}</p>
            </div>

            {/* Quick Info */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('common.passengers') || 'Passengers'}:</span>
                <span className="font-semibold">{passengers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('common.total') || 'Total'}:</span>
                <span className="font-semibold">
                  {formatPrice(calculateTotalPrice())}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              {t('common.bookNow') || 'Book Now'}
            </button>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                {t('contact.info.title') || 'Contact Info'}
              </h4>
              <div className="space-y-2">
                {settings?.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{settings.phone}</span>
                  </div>
                )}
                {settings?.email && (
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{settings.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Book Transfer</h2>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Transfer Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Transfer Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Service:</span>
                      <p className="font-medium">{transfer.title?.en || transfer.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <p className="font-medium">{transfer.category?.name?.en || transfer.category?.name || 'Transfer Service'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Vehicle:</span>
                      <p className="font-medium">{transfer.category?.vehicleType || 'Car'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium">{transfer.duration || 0} minutes</p>
                    </div>
                    <div>
                      <span className="text-gray-600">From:</span>
                      <p className="font-medium">{transfer.from?.en || transfer.from}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">To:</span>
                      <p className="font-medium">{transfer.to?.en || transfer.to}</p>
                    </div>
                  </div>
                </div>

                {/* Travel Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      value={bookingData.travelDate}
                      onChange={(e) => handleInputChange('travelDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Passengers *
                    </label>
                    <select
                      value={bookingData.travelers}
                      onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'passenger' : 'passengers'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={bookingData.customerInfo.name}
                        onChange={(e) => handleInputChange('customerInfo.name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={bookingData.customerInfo.email}
                        onChange={(e) => handleInputChange('customerInfo.email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="flex gap-2">
                        <select
                          className="border border-gray-300 rounded-md px-3 py-2 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={bookingData.customerInfo.countryCode}
                          onChange={(e) => handleInputChange('customerInfo.countryCode', e.target.value)}
                        >
                          {countries.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.phoneCode}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={bookingData.customerInfo.phone}
                          onChange={(e) => handleInputChange('customerInfo.phone', e.target.value)}
                          placeholder="123 456 789"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    rows={3}
                    placeholder="Any special requirements or requests..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Price Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Price per trip:</span>
                      <span>{formatPrice(getTransferPrice())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passengers:</span>
                      <span>{bookingData.travelers}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>{formatPrice(bookingData.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferDetailPage;

