import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockIconSolid,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useApi } from '../contexts/ApiContext';

const BookingsPage = () => {
  const { t } = useTranslation();
  const { api } = useApi();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    productType: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 20,
        ...filters
      };

      const response = await api.bookings.getAll(params);
      setBookings(response.data.bookings);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch bookings');
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.bookings.update(bookingId, { status: newStatus });
      toast.success('Booking status updated successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.bookings.cancel(bookingId, { cancellationReason: 'Cancelled by admin' });
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Contact for price';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIconSolid className="w-4 h-4" />;
      case 'pending':
        return <ClockIconSolid className="w-4 h-4" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      productType: '',
      search: ''
    });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
        <p className="text-gray-600">Manage all tour and transfer bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by name, email, phone..."
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type
            </label>
            <select
              value={filters.productType}
              onChange={(e) => handleFilterChange('productType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="tour">Tour</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchBookings}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                                         <h3 className="text-xl font-semibold text-gray-900">
                       {booking.tourDetails?.name || booking.transferDetails?.name || booking.productId?.title?.en || 'Booking'}
                     </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {booking.productType}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Travel: {formatDate(booking.travelDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>Booked: {formatDate(booking.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>Total: {formatPrice(booking.totalPrice)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Travelers: {booking.travelers}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  {/* Status Update Dropdown */}
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={booking.status === 'cancelled'}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Booking Details */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Booking ID:</strong> {booking._id}</p>
                      <p><strong>Travelers:</strong> {booking.travelers} {booking.travelers === 1 ? 'person' : 'people'}</p>
                                             {booking.tourDetails?.duration && (
                         <p><strong>Duration:</strong> {booking.tourDetails.duration.days} days</p>
                       )}
                       {booking.tourDetails?.location && (
                         <p><strong>Location:</strong> {booking.tourDetails.location}</p>
                       )}
                       {booking.transferDetails?.from && booking.transferDetails?.to && (
                         <p><strong>Route:</strong> {booking.transferDetails.from} → {booking.transferDetails.to}</p>
                       )}
                       {booking.transferDetails?.vehicle && (
                         <p><strong>Vehicle:</strong> {booking.transferDetails.vehicle}</p>
                       )}
                      {booking.specialRequests && (
                        <p><strong>Special Requests:</strong> {booking.specialRequests}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {booking.customerInfo?.name && (
                        <p><strong>Name:</strong> {booking.customerInfo.name}</p>
                      )}
                      {booking.customerInfo?.email && (
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="w-4 h-4" />
                          <span>{booking.customerInfo.email}</span>
                        </div>
                      )}
                      {booking.customerInfo?.phone && (
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="w-4 h-4" />
                          <span>{booking.customerInfo.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {booking.user ? (
                        <>
                          <p><strong>Registered User:</strong> Yes</p>
                          <p><strong>Name:</strong> {booking.user.name}</p>
                          <p><strong>Email:</strong> {booking.user.email}</p>
                        </>
                      ) : (
                        <p><strong>Guest Booking:</strong> No account</p>
                      )}
                      {booking.cancellationReason && (
                        <p><strong>Cancellation Reason:</strong> {booking.cancellationReason}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CalendarIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">No bookings match your current filters.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Summary */}
      {pagination.total > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} bookings
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
