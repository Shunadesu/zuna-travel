const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
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
  content: {
    en: {
      type: String,
      required: [true, 'English content is required']
    },
    vi: {
      type: String,
      required: [true, 'Vietnamese content is required']
    }
  },
  excerpt: {
    en: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    vi: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters']
    }
  },
  featuredImage: {
    url: String,
    publicId: String,
    alt: {
      en: String,
      vi: String
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  tags: [{
    en: String,
    vi: String
  }],
  categories: [{
    type: String,
    enum: ['travel-tips', 'destinations', 'food-culture', 'news', 'guides']
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number, // in minutes
    default: 5
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
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
}, {
  timestamps: true
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ isFeatured: 1, isPublished: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ views: -1 });

// Text search index
blogSchema.index({
  'title.en': 'text',
  'title.vi': 'text',
  'content.en': 'text',
  'content.vi': 'text',
  'excerpt.en': 'text',
  'excerpt.vi': 'text'
});

// Pre-save middleware to generate slug and set publishedAt
blogSchema.pre('save', function(next) {
  // Generate slug from English title
  if (this.isModified('title.en') && !this.slug) {
    this.slug = this.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Set publishedAt when first published
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Calculate reading time based on content length
  if (this.isModified('content.en')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.en.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }

  next();
});

// Static method to get published blogs
blogSchema.statics.getPublished = function() {
  return this.find({ isPublished: true }).sort({ publishedAt: -1 });
};

// Method to increment views
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Blog', blogSchema);
