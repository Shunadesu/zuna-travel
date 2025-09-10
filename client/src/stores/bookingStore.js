import { create } from 'zustand';
import api from '../contexts/ApiContext';

const useBookingStore = create((set, get) => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  pagination: null,
  fetchPromise: null,

  // Create booking
  createBooking: async (bookingData) => {
    try {
      set({ loading: true, error: null });
      
      // Validate booking data
      if (!bookingData.productId || !bookingData.productType) {
        throw new Error('Thiếu thông tin sản phẩm');
      }
      
      if (!bookingData.customerInfo?.email || !bookingData.customerInfo?.phone) {
        throw new Error('Thiếu thông tin liên hệ');
      }
      
      if (!bookingData.travelDate) {
        throw new Error('Thiếu ngày du lịch');
      }
      
      const response = await api.bookings.create(bookingData);
      
      // Add to local bookings if it's a user booking
      const { bookings } = get();
      if (response.data.booking) {
        set({ 
          bookings: [response.data.booking, ...bookings],
          loading: false 
        });
      } else {
        set({ loading: false });
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tạo booking';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw error;
    }
  },

  // Get user's bookings
  fetchMyBookings: async (params = {}) => {
    const { fetchPromise } = get();
    if (fetchPromise) {
      return fetchPromise;
    }

    const promise = (async () => {
      try {
        set({ loading: true, error: null });
        const response = await api.bookings.getMyBookings(params);
        set({ 
          bookings: response.data.bookings, 
          pagination: response.data.pagination,
          loading: false 
        });
        return response.data;
      } catch (error) {
        // Don't set error for 401 (unauthorized) as it's expected for non-logged in users
        if (error.response?.status !== 401) {
          set({ 
            error: error.response?.data?.message || 'Failed to fetch bookings', 
            loading: false 
          });
        } else {
          set({ loading: false });
        }
        throw error;
      } finally {
        set({ fetchPromise: null });
      }
    })();

    set({ fetchPromise: promise });
    return promise;
  },

  // Get booking by ID
  fetchBookingById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.bookings.getById(id);
      set({ 
        currentBooking: response.data, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch booking', 
        loading: false 
      });
      throw error;
    }
  },

  // Update booking
  updateBooking: async (id, updateData) => {
    try {
      set({ loading: true, error: null });
      const response = await api.bookings.update(id, updateData);
      
      // Update in local state
      const { bookings } = get();
      const updatedBookings = bookings.map(booking => 
        booking._id === id ? response.data.booking : booking
      );
      
      set({ 
        bookings: updatedBookings,
        currentBooking: response.data.booking,
        loading: false 
      });
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update booking', 
        loading: false 
      });
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (id, cancellationReason) => {
    try {
      set({ loading: true, error: null });
      const response = await api.bookings.cancel(id, { cancellationReason });
      
      // Update in local state
      const { bookings } = get();
      const updatedBookings = bookings.map(booking => 
        booking._id === id ? response.data.booking : booking
      );
      
      set({ 
        bookings: updatedBookings,
        currentBooking: response.data.booking,
        loading: false 
      });
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to cancel booking', 
        loading: false 
      });
      throw error;
    }
  },

  // Get guest bookings by email
  fetchGuestBookings: async (email, params = {}) => {
    try {
      set({ loading: true, error: null });
      
      // Validate email format if provided
      if (email && !params.phone) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Địa chỉ email không hợp lệ');
        }
      }
      
      const response = await api.bookings.getGuestBookings(email, params);
      set({ 
        bookings: response.data.bookings, 
        pagination: response.data.pagination,
        loading: false 
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Không thể tìm thấy booking';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw error;
    }
  },

  // Get all bookings (admin only)
  fetchAllBookings: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const response = await api.bookings.getAll(params);
      set({ 
        bookings: response.data.bookings, 
        pagination: response.data.pagination,
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch all bookings', 
        loading: false 
      });
      throw error;
    }
  },

  // Clear current booking
  clearCurrentBooking: () => set({ currentBooking: null }),

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    pagination: null,
    fetchPromise: null,
  }),
}));

export default useBookingStore;
