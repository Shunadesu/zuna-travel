const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    en: { type: String, required: true },
    vi: { type: String, required: true }
  },
  shortDescription: {
    en: { type: String },
    vi: { type: String }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourCategory',
    required: true
  },
  pricing: {
    adult: { type: Number, required: true },
    child: { type: Number, default: 0 },
    currency: { type: String, enum: ['USD', 'VND'], default: 'USD' }
  },
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number, default: 0 }
  },
  location: {
    en: { type: String },
    vi: { type: String }
  },
  highlights: [{
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
    type: String
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging'],
    default: 'easy'
  },
  amenities: [{
    en: String,
    vi: String
  }],
  features: [{
    en: String,
    vi: String
  }]
}, {
  timestamps: true
});

// Indexes
tourSchema.index({ slug: 1 });
tourSchema.index({ category: 1 });
tourSchema.index({ isActive: 1 });
tourSchema.index({ isFeatured: 1 });
tourSchema.index({ region: 1 });
tourSchema.index({ order: 1 });

// Virtual for full duration
tourSchema.virtual('fullDuration').get(function() {
  if (this.duration.nights > 0) {
    return `${this.duration.days} days ${this.duration.nights} nights`;
  }
  return `${this.duration.days} days`;
});

// Ensure virtuals are serialized
tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tour', tourSchema);
