import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookingStore } from '../stores';
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
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const { bookings, loading, error, fetchMyBookings, fetchGuestBookings, cancelBooking } = useBookingStore();
  const [searchType, setSearchType] = useState('email'); // 'email' or 'phone'
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Try to load user bookings if logged in
      fetchMyBookings().catch((error) => {
        console.log('User not authenticated or no bookings found:', error);
        setIsSearching(true);
      });
    } else {
      // If user is not logged in, show search form
      setIsSearching(true);
    }
  }, [fetchMyBookings]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      toast.error('Vui lòng nhập email hoặc số điện thoại của bạn');
      return;
    }

    try {
      if (searchType === 'email') {
        await fetchGuestBookings(searchValue);
      } else {
        // For phone search, we'll use email endpoint with phone parameter
        await fetchGuestBookings(searchValue, { phone: searchValue });
      }
    } catch (error) {
      toast.error('Không tìm thấy booking nào với thông tin này');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy booking này?')) {
      return;
    }

    try {
      await cancelBooking(bookingId, 'Hủy bởi khách hàng');
      toast.success('Hủy booking thành công');
    } catch (error) {
      toast.error('Không thể hủy booking');
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Liên hệ để biết giá';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIconSolid className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <ClockIconSolid className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt Tour Của Tôi</h1>
        <p className="text-gray-600">Quản lý và theo dõi các tour đã đặt</p>
      </div>

      {/* Search Form for Guest Users */}
      {isSearching && bookings.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tìm Booking Của Bạn</h2>
          <p className="text-gray-600 mb-4">
            Nhập email hoặc số điện thoại để tìm booking của bạn
          </p>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm theo
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="email">Email</option>
                  <option value="phone">Số điện thoại</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {searchType === 'email' ? 'Địa chỉ Email' : 'Số điện thoại'}
                </label>
                <input
                  type={searchType === 'email' ? 'email' : 'tel'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder={searchType === 'email' ? 'email@example.com' : '0123 456 789'}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tìm Booking
            </button>
          </form>
        </div>
      )}

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
                      {booking.tourDetails?.name || booking.transferDetails?.name || 'Booking'}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Ngày du lịch: {formatDate(booking.travelDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>Đặt ngày: {formatDate(booking.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>Tổng: {formatPrice(booking.totalPrice)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={booking.status === 'cancelled'}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy
                  </button>
                </div>
              </div>

              {/* Booking Details */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Chi Tiết Booking</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Mã Booking:</strong> {booking._id}</p>
                      <p><strong>Số khách:</strong> {booking.travelers} {booking.travelers === 1 ? 'người' : 'người'}</p>
                      {booking.tourDetails?.duration && (
                        <p><strong>Thời gian:</strong> {booking.tourDetails.duration.days} ngày</p>
                      )}
                      {booking.tourDetails?.location && (
                        <p><strong>Địa điểm:</strong> {booking.tourDetails.location}</p>
                      )}
                      {booking.transferDetails?.from && booking.transferDetails?.to && (
                        <p><strong>Tuyến đường:</strong> {booking.transferDetails.from} → {booking.transferDetails.to}</p>
                      )}
                      {booking.transferDetails?.vehicle && (
                        <p><strong>Phương tiện:</strong> {booking.transferDetails.vehicle}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Thông Tin Liên Hệ</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {booking.customerInfo?.name && (
                        <p><strong>Tên:</strong> {booking.customerInfo.name}</p>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !isSearching ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CalendarIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có booking nào</h3>
          <p className="text-gray-600 mb-6">Bạn chưa đặt tour nào.</p>
          <Link
            to="/tours"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Xem Tours
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default MyBookingsPage;
