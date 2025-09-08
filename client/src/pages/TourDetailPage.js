import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTourStore, useBookingStore } from '../stores';
import { countries } from '../utils/countries';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  StarIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const TourDetailPage = () => {
  const { slug } = useParams();
  const { getTourBySlug, fetchTourBySlug, loading, error } = useTourStore();
  const { createBooking, loading: bookingLoading } = useBookingStore();
  const [tour, setTour] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    travelers: 1,
    date: '',
    totalPrice: 0,
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      countryCode: 'VN' // Mặc định là Việt Nam
    }
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setIsInitialLoad(true);
        // First try to get from cache
        let tourData = getTourBySlug(slug);
        
        // If not in cache, fetch from API
        if (!tourData) {
          tourData = await fetchTourBySlug(slug);
        }
        
        setTour(tourData);
      } catch (error) {
        console.error('Error fetching tour:', error);
        setTour(null);
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchTour();
  }, [slug, getTourBySlug, fetchTourBySlug]);

  useEffect(() => {
    if (tour) {
      updateTotalPrice(bookingData.travelers);
    }
  }, [tour]);

  if (loading || isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || (!tour && !isInitialLoad)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour not found</h2>
          <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist.</p>
          <Link 
            to="/tours" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Contact for price';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDuration = (duration) => {
    if (!duration) return '1 day';
    if (typeof duration === 'object' && duration.days) {
      return duration.days === 1 ? '1 day' : `${duration.days} days`;
    }
    if (typeof duration === 'number') {
      return duration === 1 ? '1 day' : `${duration} days`;
    }
    return '1 day';
  };

  const getTourPrice = () => {
    if (!tour) return 0;
    // Check for different pricing structures
    if (tour.pricing?.adult) return tour.pricing.adult;
    if (tour.pricing?.perTrip) return tour.pricing.perTrip;
    if (tour.price) return tour.price;
    return 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!bookingData.customerInfo.email || !bookingData.customerInfo.phone) {
      toast.error('Please fill in your email and phone number');
      return;
    }

    if (!bookingData.date) {
      toast.error('Please select a travel date');
      return;
    }

    try {
      const bookingPayload = {
        productId: tour._id,
        productType: 'tour',
        travelers: bookingData.travelers,
        travelDate: bookingData.date,
        totalPrice: bookingData.totalPrice,
        customerInfo: bookingData.customerInfo,
        tourDetails: {
          name: tour.name?.en || tour.name,
          duration: tour.duration,
          location: tour.location?.en || tour.location
        }
      };

      await createBooking(bookingPayload);
      toast.success('Booking submitted successfully! We will contact you soon.');
      setIsBookingModalOpen(false);
      
      // Reset form
      setBookingData({
        travelers: 1,
        date: '',
        totalPrice: 0,
        customerInfo: {
          name: '',
          email: '',
          phone: '',
          countryCode: 'VN'
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit booking');
    }
  };

  const updateTotalPrice = (travelers) => {
    const basePrice = getTourPrice();
    setBookingData(prev => ({
      ...prev,
      travelers,
      totalPrice: basePrice * travelers
    }));
  };

  const handleCustomerInfoChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/tours" className="text-gray-700 hover:text-blue-600">
                Tours
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">{tour.name?.en || tour.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <img
                src={tour.images?.[selectedImage]?.url || '/placeholder-tour.jpg'}
                alt={tour.name?.en || tour.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-full ${
                    isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
                  } hover:bg-red-500 hover:text-white transition-colors`}
                >
                  <HeartIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors">
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            {tour.images && tour.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {tour.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${tour.name?.en || tour.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tour Title and Rating */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {tour.name?.en || tour.name}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <StarIconSolid className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 text-gray-700">4.8</span>
                <span className="ml-1 text-gray-500">(124 reviews)</span>
              </div>
              <span className="text-green-600 font-medium">Best Seller</span>
            </div>
          </div>

          {/* Tour Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{formatDuration(tour.duration)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{tour.location?.en || tour.location || 'Vietnam'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Start Time</p>
                <p className="font-medium">8:00 AM</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">{formatPrice(getTourPrice())}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {tour.description?.en || tour.description || 'No description available.'}
              </p>
            </div>
          </div>

          {/* Itinerary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Itinerary</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((day) => (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Day {day}</h3>
                  <p className="text-gray-600">
                    {day === 1 && 'Arrival and welcome dinner'}
                    {day === 2 && 'Full day exploration of local attractions'}
                    {day === 3 && 'Departure and farewell'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-green-600 mb-2">✓ Included</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Hotel accommodation</li>
                  <li>• Daily breakfast</li>
                  <li>• Professional guide</li>
                  <li>• Transportation</li>
                  <li>• Entrance fees</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-600 mb-2">✗ Not Included</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• International flights</li>
                  <li>• Personal expenses</li>
                  <li>• Travel insurance</li>
                  <li>• Tips and gratuities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Booking Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(getTourPrice())}
              </span>
              <span className="text-gray-500"> per person</span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={bookingData.travelers}
                  onChange={(e) => {
                    const travelers = parseInt(e.target.value);
                    setBookingData(prev => ({ ...prev, travelers }));
                    updateTotalPrice(travelers);
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingData.date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
            >
              Book Now
            </button>
            
            <button className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Contact Us
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Free cancellation</span>
                <span className="text-green-600 font-medium">Up to 24h</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Instant confirmation</span>
                <span className="text-green-600 font-medium">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Book Your Tour</h2>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">{tour.name?.en || tour.name}</h3>
                <p className="text-sm text-gray-600">{formatDuration(tour.duration)} • {tour.location?.en || tour.location || 'Vietnam'}</p>
              </div>

                             <form onSubmit={handleBookingSubmit} className="space-y-4">
                 {/* Customer Information */}
                 <div className="border-b border-gray-200 pb-4">
                   <h4 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Full Name
                       </label>
                       <input
                         type="text"
                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
                         value={bookingData.customerInfo.name}
                         onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                         placeholder="Your full name"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Email *
                       </label>
                       <input
                         type="email"
                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
                         value={bookingData.customerInfo.email}
                         onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                         placeholder="your.email@example.com"
                         required
                       />
                     </div>
                   </div>
                   <div className="mt-4">
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Phone Number *
                     </label>
                     <div className="flex gap-2">
                       <select
                         className="border border-gray-300 rounded-lg px-3 py-2 min-w-[120px]"
                         value={bookingData.customerInfo.countryCode}
                         onChange={(e) => handleCustomerInfoChange('countryCode', e.target.value)}
                       >
                         {countries.map(country => (
                           <option key={country.code} value={country.code}>
                             {country.flag} {country.phoneCode}
                           </option>
                         ))}
                       </select>
                       <input
                         type="tel"
                         className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                         value={bookingData.customerInfo.phone}
                         onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                         placeholder="123 456 789"
                         required
                       />
                     </div>
                   </div>
                 </div>

                 {/* Travel Details */}
                 <div className="border-b border-gray-200 pb-4">
                   <h4 className="text-lg font-medium text-gray-900 mb-3">Travel Details</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Number of Travelers
                       </label>
                       <select 
                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
                         value={bookingData.travelers}
                         onChange={(e) => {
                           const travelers = parseInt(e.target.value);
                           setBookingData(prev => ({ ...prev, travelers }));
                           updateTotalPrice(travelers);
                         }}
                         required
                       >
                         {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                           <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                         ))}
                       </select>
                     </div>

                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Travel Date *
                       </label>
                       <input
                         type="date"
                         className="w-full border border-gray-300 rounded-lg px-3 py-2"
                         min={new Date().toISOString().split('T')[0]}
                         value={bookingData.date}
                         onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                         required
                       />
                     </div>
                   </div>
                 </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per person:</span>
                    <span className="font-medium">{formatPrice(getTourPrice())}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Number of travelers:</span>
                    <span className="font-medium">{bookingData.travelers}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatPrice(bookingData.totalPrice)}</span>
                  </div>
                </div>

                                 <div className="flex space-x-3 pt-4">
                   <button
                     type="button"
                     onClick={() => setIsBookingModalOpen(false)}
                     className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                     disabled={bookingLoading}
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     disabled={bookingLoading}
                   >
                     {bookingLoading ? 'Submitting...' : 'Confirm Booking'}
                   </button>
                 </div>
              </form>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Free cancellation</span>
                  <span className="text-green-600 font-medium">Up to 24h</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-500">Instant confirmation</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetailPage;



