const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // User information (can be guest or registered user)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest bookings
  },
  customerInfo: {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  
  // Product information
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productType: {
    type: String,
    enum: ['tour', 'transfer'],
    required: true
  },
  
  // Tour details for reference
  tourDetails: {
    name: String,
    duration: {
      days: Number,
      nights: Number
    },
    location: String
  },
  
  // Transfer details for reference
  transferDetails: {
    name: String,
    from: String,
    to: String,
    duration: Number,
    vehicle: String
  },
  
  // Booking details
  travelDate: {
    type: Date,
    required: true
  },
  travelers: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Pricing
  totalPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['USD', 'VND'],
    default: 'USD'
  },
  
  // Special requirements
  specialRequests: {
    type: String,
    trim: true
  },
  
  // Pickup/Dropoff information (for transfers)
  pickupLocation: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  dropoffLocation: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending'
  },
  
  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'online'],
    default: 'cash'
  },
  
  // Cancellation
  cancellationReason: String,
  cancellationDate: Date,
  refundAmount: Number,
  
  // Notes
  adminNotes: String,
  customerNotes: String,
  
  // Contact information
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ travelDate: 1 });
bookingSchema.index({ 'customerInfo.email': 1 });
bookingSchema.index({ 'customerInfo.phone': 1 });

// Virtual for total number of people
bookingSchema.virtual('totalPeople').get(function() {
  return this.travelers;
});

// Ensure virtuals are serialized
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);
