const mongoose = require('mongoose');

const tourCategorySchema = new mongoose.Schema({
  name: {
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
  highlights: [{
    en: String,
    vi: String
  }],
  features: [{
    en: String,
    vi: String
  }],
  amenities: [{
    en: String,
    vi: String
  }]
}, {
  timestamps: true
});

// Indexes
tourCategorySchema.index({ slug: 1 });
tourCategorySchema.index({ isActive: 1 });
tourCategorySchema.index({ isFeatured: 1 });
tourCategorySchema.index({ region: 1 });
tourCategorySchema.index({ order: 1 });

// Ensure virtuals are serialized
tourCategorySchema.set('toJSON', { virtuals: true });
tourCategorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TourCategory', tourCategorySchema);
