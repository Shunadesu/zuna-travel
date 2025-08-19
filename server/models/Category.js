const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    en: {
      type: String,
      required: [true, 'English name is required'],
      trim: true
    },
    vi: {
      type: String,
      required: [true, 'Vietnamese name is required'],
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
      trim: true
    },
    vi: {
      type: String,
      trim: true
    }
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
  type: {
    type: String,
    enum: ['vietnam-tours', 'transfer-services'],
    required: [true, 'Category type is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  // Parent category for subcategories
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  // Subcategories
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  // Level of category (0: main category, 1: subcategory, 2: sub-subcategory)
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 2
  },
  // Location/destination specific fields
  location: {
    en: String,
    vi: String
  },
  region: {
    type: String,
    enum: ['north', 'central', 'south', 'all'],
    default: 'all'
  },
  // Seats configuration for transfer services
  seats: {
    type: Number,
    min: 1,
    max: 100,
    default: null
  },
  // Vehicle type for transfer services
  vehicleType: {
    type: String,
    enum: ['Luxury LIMO', 'Sharing Bus', 'Private', 'Shuttle Bus', 'Private car/Private LIMO', 'LIMO', 'Sleeping Bus', 'Private car', 'Airport Transfer'],
    required: function() {
      return this.type === 'transfer-services';
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
  }
}, {
  timestamps: true
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ type: 1, isActive: 1 });
categorySchema.index({ sortOrder: 1 });

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name.en') && !this.slug) {
    this.slug = this.name.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
