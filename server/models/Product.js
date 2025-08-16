const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    en: {
      type: String,
      required: [true, 'English title is required'],
      trim: true
    },
    vi: {
      type: String,
      required: [true, 'Vietnamese title is required'],
      trim: true
    }
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    en: {
      type: String,
      required: [true, 'English description is required']
    },
    vi: {
      type: String,
      required: [true, 'Vietnamese description is required']
    }
  },
  shortDescription: {
    en: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    vi: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters']
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    alt: {
      en: String,
      vi: String
    }
  }],
  pricing: {
    adult: {
      type: Number,
      min: [0, 'Adult price cannot be negative']
    },
    child: {
      type: Number,
      min: [0, 'Child price cannot be negative']
    },
    currency: {
      type: String,
      enum: ['USD', 'VND'],
      default: 'USD'
    },
    // For transfer services - price per trip/vehicle
    perTrip: {
      type: Number,
      min: [0, 'Per trip price cannot be negative']
    },
    perKm: {
      type: Number,
      min: [0, 'Per km price cannot be negative']
    }
  },
  duration: {
    days: {
      type: Number,
      min: [1, 'Duration must be at least 1 day']
    },
    nights: {
      type: Number,
      min: [0, 'Nights cannot be negative']
    }
  },
  location: {
    en: String,
    vi: String
  },
  highlights: [{
    en: String,
    vi: String
  }],
  itinerary: [{
    day: Number,
    title: {
      en: String,
      vi: String
    },
    description: {
      en: String,
      vi: String
    },
    meals: {
      breakfast: Boolean,
      lunch: Boolean,
      dinner: Boolean
    },
    accommodation: {
      en: String,
      vi: String
    }
  }],
  included: [{
    en: String,
    vi: String
  }],
  excluded: [{
    en: String,
    vi: String
  }],
  requirements: {
    en: String,
    vi: String
  },
  cancellationPolicy: {
    en: String,
    vi: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  seo: {
    title: {
      en: String,
      vi: String
    },
    description: {
      en: String,
      vi: String
    },
    keywords: [{
      type: String
    }]
  },
  
  // Transfer Service specific fields
  transferService: {
    type: {
      type: String,
      enum: [
        'luxury-limo',
        'sharing-bus', 
        'private-car',
        'shuttle-bus',
        'private-limo',
        'sleeping-bus',
        'airport-transfer',
        'city-transfer',
        'intercity-transfer'
      ]
    },
    seats: {
      type: Number,
      min: [1, 'Seats must be at least 1'],
      max: [45, 'Maximum seats is 45']
    },
    vehicleInfo: {
      model: String,
      year: Number,
      features: [{
        en: String,
        vi: String
      }],
      amenities: [{
        en: String,
        vi: String
      }]
    },
    route: {
      departure: {
        en: String,
        vi: String
      },
      destination: {
        en: String,
        vi: String
      },
      distance: Number, // in kilometers
      estimatedTime: Number, // in minutes
      pickupPoints: [{
        name: {
          en: String,
          vi: String
        },
        address: {
          en: String,
          vi: String
        },
        coordinates: {
          lat: Number,
          lng: Number
        }
      }],
      dropoffPoints: [{
        name: {
          en: String,
          vi: String
        },
        address: {
          en: String,
          vi: String
        },
        coordinates: {
          lat: Number,
          lng: Number
        }
      }]
    },
    schedule: {
      frequency: String, // 'daily', 'hourly', 'on-demand'
      operatingHours: {
        start: String, // '06:00'
        end: String    // '22:00'
      },
      departureTimes: [String], // ['06:00', '08:00', '10:00']
      availability: {
        monday: Boolean,
        tuesday: Boolean,
        wednesday: Boolean,
        thursday: Boolean,
        friday: Boolean,
        saturday: Boolean,
        sunday: Boolean
      }
    },
    bookingPolicy: {
      advanceBooking: Number, // hours in advance
      cancellationDeadline: Number, // hours before departure
      minimumPassengers: Number,
      maximumPassengers: Number
    }
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ 'pricing.adult': 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ sortOrder: 1 });

// Transfer service indexes
productSchema.index({ 'transferService.type': 1 });
productSchema.index({ 'transferService.seats': 1 });
productSchema.index({ 'transferService.route.departure.en': 1 });
productSchema.index({ 'transferService.route.destination.en': 1 });
productSchema.index({ 'pricing.perTrip': 1 });

// Text search index
productSchema.index({
  'title.en': 'text',
  'title.vi': 'text',
  'description.en': 'text',
  'description.vi': 'text'
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('title.en') && !this.slug) {
    this.slug = this.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
