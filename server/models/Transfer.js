const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  title: {
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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransferCategory',
    required: true
  },
  pricing: {
    adult: { type: Number, required: true },
    child: { type: Number, default: 0 },
    currency: { type: String, enum: ['USD', 'VND'], default: 'USD' }
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  from: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  to: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  vehicleType: {
    type: String,
    enum: ['car', 'van', 'bus', 'limousine', 'motorbike'],
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  features: [{
    en: String,
    vi: String
  }],
  amenities: [{
    en: String,
    vi: String
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
    required: true
  },
  route: {
    type: String,
    required: true
  },
  distance: {
    type: Number, // in kilometers
    required: true
  }
}, {
  timestamps: true
});

// Indexes
transferSchema.index({ slug: 1 });
transferSchema.index({ category: 1 });
transferSchema.index({ isActive: 1 });
transferSchema.index({ isFeatured: 1 });
transferSchema.index({ region: 1 });
transferSchema.index({ vehicleType: 1 });
transferSchema.index({ route: 1 });
transferSchema.index({ order: 1 });

// Virtual for duration in hours
transferSchema.virtual('durationHours').get(function() {
  return Math.round(this.duration / 60 * 10) / 10; // Round to 1 decimal place
});

// Virtual for full route
transferSchema.virtual('fullRoute').get(function() {
  return `${this.from.en} → ${this.to.en}`;
});

// Ensure virtuals are serialized
transferSchema.set('toJSON', { virtuals: true });
transferSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Transfer', transferSchema);
