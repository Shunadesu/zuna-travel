const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Consultation Details
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Additional Information
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp'],
    default: 'email'
  },
  preferredContactTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'anytime'],
    default: 'anytime'
  },
  
  // Travel Information (Optional)
  travelDates: {
    startDate: Date,
    endDate: Date,
    flexible: { type: Boolean, default: true }
  },
  numberOfTravelers: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 }
  },
  budget: {
    type: String,
    enum: ['under-1000', '1000-3000', '3000-5000', '5000-10000', 'over-10000'],
    default: 'under-1000'
  },
  interests: [{
    type: String,
    enum: ['culture', 'nature', 'adventure', 'relaxation', 'food', 'history', 'beach', 'mountains']
  }],
  
  // Status and Management
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'completed', 'cancelled'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Admin Notes
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Contact History
  contactHistory: [{
    method: {
      type: String,
      enum: ['email', 'phone', 'whatsapp', 'meeting']
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    contactedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Source Information
  source: {
    type: String,
    enum: ['website', 'facebook', 'instagram', 'google', 'referral', 'other'],
    default: 'website'
  },
  referrerUrl: String,
  
  // Tour Reference (if consultation is about a specific tour)
  tourReference: {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour'
    },
    tourTitle: String,
    tourSlug: String,
    tourPrice: Number
  },
  
  // Response Information
  responseTime: {
    type: Number, // in hours
    default: null
  },
  firstResponseAt: Date,
  lastContactAt: Date,
  
  // Metadata
  ipAddress: String,
  userAgent: String,
  language: {
    type: String,
    default: 'en'
  }
}, {
  timestamps: true
});

// Indexes for better performance
consultationSchema.index({ email: 1 });
consultationSchema.index({ status: 1 });
consultationSchema.index({ priority: 1 });
consultationSchema.index({ createdAt: -1 });
consultationSchema.index({ source: 1 });

// Virtual for full name
consultationSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for contact info
consultationSchema.virtual('contactInfo').get(function() {
  return {
    email: this.email,
    phone: this.phone,
    preferredMethod: this.preferredContactMethod,
    preferredTime: this.preferredContactTime
  };
});

// Virtual for travel summary
consultationSchema.virtual('travelSummary').get(function() {
  return {
    dates: this.travelDates,
    travelers: this.numberOfTravelers,
    budget: this.budget,
    interests: this.interests
  };
});

// Ensure virtuals are serialized
consultationSchema.set('toJSON', { virtuals: true });
consultationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Consultation', consultationSchema);
