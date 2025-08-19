const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Branding
  primaryColor: {
    type: String,
    default: '#3B82F6', // Blue
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Primary color must be a valid hex color'
    }
  },
  secondaryColor: {
    type: String,
    default: '#10B981', // Green
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Secondary color must be a valid hex color'
    }
  },
  
  // Company Information
  companyName: {
    en: { type: String, default: 'Zuna Travel' },
    vi: { type: String, default: 'Zuna Travel' }
  },
  companyDescription: {
    en: { type: String, default: 'Your trusted travel partner in Vietnam' },
    vi: { type: String, default: 'Đối tác du lịch đáng tin cậy của bạn tại Việt Nam' }
  },
  
  // Contact Information
  email: {
    type: String,
    default: 'info@zunatravel.com',
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email must be a valid email address'
    }
  },
  phone: {
    type: String,
    default: '+84 123 456 789',
    validate: {
      validator: function(v) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Phone must be a valid phone number'
    }
  },
  whatsapp: {
    type: String,
    default: '+84 123 456 789'
  },
  
  // Social Media
  facebook: {
    type: String,
    default: 'https://facebook.com/zunatravel'
  },
  instagram: {
    type: String,
    default: 'https://instagram.com/zunatravel'
  },
  youtube: {
    type: String,
    default: 'https://youtube.com/zunatravel'
  },
  tiktok: {
    type: String,
    default: 'https://tiktok.com/@zunatravel'
  },
  
  // Address
  address: {
    en: { type: String, default: '123 Travel Street, Ho Chi Minh City, Vietnam' },
    vi: { type: String, default: '123 Đường Du Lịch, Thành phố Hồ Chí Minh, Việt Nam' }
  },
  
  // Business Hours
  businessHours: {
    en: { type: String, default: 'Monday - Friday: 8:00 AM - 6:00 PM' },
    vi: { type: String, default: 'Thứ 2 - Thứ 6: 8:00 - 18:00' }
  },
  
  // SEO
  metaTitle: {
    en: { type: String, default: 'Zuna Travel - Your Vietnam Travel Partner' },
    vi: { type: String, default: 'Zuna Travel - Đối tác du lịch Việt Nam của bạn' }
  },
  metaDescription: {
    en: { type: String, default: 'Discover Vietnam with Zuna Travel. Book your perfect tour package today.' },
    vi: { type: String, default: 'Khám phá Việt Nam cùng Zuna Travel. Đặt gói tour hoàn hảo ngay hôm nay.' }
  },
  metaKeywords: {
    type: [String],
    default: ['Vietnam travel', 'tour packages', 'Zuna Travel', 'Vietnam tours']
  },
  
  // Top Bar Styling
  topBar: {
    backgroundColor: {
      type: String,
      default: '#1F2937', // Dark gray
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Top bar background color must be a valid hex color'
      }
    },
    textColor: {
      type: String,
      default: '#FFFFFF', // White
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Top bar text color must be a valid hex color'
      }
    },
    hoverColor: {
      type: String,
      default: '#93C5FD', // Light blue
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Top bar hover color must be a valid hex color'
      }
    }
  },
  
  // Footer Styling
  footer: {
    backgroundColor: {
      type: String,
      default: '#1F2937', // Dark gray
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Footer background color must be a valid hex color'
      }
    },
    textColor: {
      type: String,
      default: '#FFFFFF', // White
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Footer text color must be a valid hex color'
      }
    },
    secondaryTextColor: {
      type: String,
      default: '#D1D5DB', // Light gray
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Footer secondary text color must be a valid hex color'
      }
    },
    borderColor: {
      type: String,
      default: '#374151', // Medium gray
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Footer border color must be a valid hex color'
      }
    }
  },
  
  // Footer
  footerText: {
    en: { type: String, default: '© 2024 Zuna Travel. All rights reserved.' },
    vi: { type: String, default: '© 2024 Zuna Travel. Tất cả quyền được bảo lưu.' }
  },
  
  // Features
  features: {
    enableBooking: { type: Boolean, default: true },
    enableReviews: { type: Boolean, default: true },
    enableNewsletter: { type: Boolean, default: true },
    enableSocialLogin: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false }
  },
  
  // Analytics
  googleAnalyticsId: {
    type: String,
    default: ''
  },
  facebookPixelId: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne().lean();
  if (!settings) {
    settings = new this();
    await settings.save();
    return settings.toObject();
  }
  return settings;
};

// Update settings
settingsSchema.statics.updateSettings = async function(updateData) {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this();
  }
  
  Object.assign(settings, updateData);
  await settings.save();
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);



