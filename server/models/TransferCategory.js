const mongoose = require('mongoose');

const transferCategorySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  shortDescription: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  region: {
    type: String,
    enum: ['north', 'central', 'south', 'all'],
    required: true
  },
  // New hierarchical structure
  serviceType: {
    type: String,
    enum: ['private', 'shared', 'train', 'special'],
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['car', 'van', 'bus', 'limousine', 'motorbike', 'train'],
    required: true
  },
  capacity: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 50 },
    default: { type: Number, default: 4 }
  },
  route: {
    from: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    to: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    distance: { type: Number }, // in kilometers
    duration: { type: Number } // in minutes
  },
  features: [{
    en: String,
    vi: String
  }],
  amenities: [{
    en: String,
    vi: String
  }],
  // Pricing structure
  pricing: {
    basePrice: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'VND'], default: 'USD' },
    pricePerKm: { type: Number, default: 0 },
    pricePerHour: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
transferCategorySchema.index({ slug: 1 });
transferCategorySchema.index({ isActive: 1 });
transferCategorySchema.index({ isFeatured: 1 });
transferCategorySchema.index({ region: 1 });
transferCategorySchema.index({ serviceType: 1 });
transferCategorySchema.index({ vehicleType: 1 });
transferCategorySchema.index({ order: 1 });
transferCategorySchema.index({ 'route.from.en': 1, 'route.to.en': 1 });

// Ensure virtuals are serialized
transferCategorySchema.set('toJSON', { virtuals: true });
transferCategorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TransferCategory', transferCategorySchema);
