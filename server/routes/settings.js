const express = require('express');
const { body, validationResult } = require('express-validator');
const Settings = require('../models/Settings');
const { protect: authenticateToken, admin: requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
      'ETag': `"${settings._id}-${settings.updatedAt.getTime()}"`,
      'Vary': 'Accept-Encoding'
    });
    
    res.json({
      message: 'Settings retrieved successfully',
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      message: 'Failed to get settings',
      error: error.message
    });
  }
});

// Get settings by admin (with all fields)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    res.json({
      message: 'Settings retrieved successfully',
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      message: 'Failed to get settings',
      error: error.message
    });
  }
});

// Update settings (admin only)
router.put('/', authenticateToken, requireAdmin, [
  // Branding validation
  body('primaryColor').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Primary color must be a valid hex color'),
  body('secondaryColor').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Secondary color must be a valid hex color'),
  
  // Company information validation
  body('companyName.en').optional().trim().notEmpty()
    .withMessage('English company name cannot be empty'),
  body('companyName.vi').optional().trim().notEmpty()
    .withMessage('Vietnamese company name cannot be empty'),
  body('companyDescription.en').optional().trim(),
  body('companyDescription.vi').optional().trim(),
  
  // Contact validation
  body('email').optional().isEmail()
    .withMessage('Email must be a valid email address'),
  body('phone').optional().trim(),
  body('whatsapp').optional().trim(),
  
  // Social media validation
  body('facebook').optional().isURL()
    .withMessage('Facebook URL must be a valid URL'),
  body('instagram').optional().isURL()
    .withMessage('Instagram URL must be a valid URL'),
  body('youtube').optional().isURL()
    .withMessage('YouTube URL must be a valid URL'),
  body('tiktok').optional().isURL()
    .withMessage('TikTok URL must be a valid URL'),
  
  // Address validation
  body('address.en').optional().trim(),
  body('address.vi').optional().trim(),
  body('businessHours.en').optional().trim(),
  body('businessHours.vi').optional().trim(),
  
  // SEO validation
  body('metaTitle.en').optional().trim(),
  body('metaTitle.vi').optional().trim(),
  body('metaDescription.en').optional().trim(),
  body('metaDescription.vi').optional().trim(),
  body('metaKeywords').optional().isArray()
    .withMessage('Meta keywords must be an array'),
  
  // Footer validation
  body('footerText.en').optional().trim(),
  body('footerText.vi').optional().trim(),
  
  // Features validation
  body('features.enableBooking').optional().isBoolean(),
  body('features.enableReviews').optional().isBoolean(),
  body('features.enableNewsletter').optional().isBoolean(),
  body('features.enableSocialLogin').optional().isBoolean(),
  body('features.maintenanceMode').optional().isBoolean(),
  
  // Analytics validation
  body('googleAnalyticsId').optional().trim(),
  body('facebookPixelId').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updateData = req.body;
    const settings = await Settings.updateSettings(updateData);

    res.json({
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      message: 'Failed to update settings',
      error: error.message
    });
  }
});

// Reset settings to defaults (admin only)
router.post('/reset', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Delete existing settings
    await Settings.deleteMany({});
    
    // Create new settings with defaults
    const settings = new Settings();
    await settings.save();

    res.json({
      message: 'Settings reset to defaults successfully',
      data: settings
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      message: 'Failed to reset settings',
      error: error.message
    });
  }
});

// Get specific setting group (public)
router.get('/group/:group', async (req, res) => {
  try {
    const { group } = req.params;
    const settings = await Settings.getSettings();
    
    let groupData = {};
    
    switch (group) {
      case 'branding':
        groupData = {
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor
        };
        break;
      case 'company':
        groupData = {
          companyName: settings.companyName,
          companyDescription: settings.companyDescription
        };
        break;
      case 'contact':
        groupData = {
          email: settings.email,
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          address: settings.address,
          businessHours: settings.businessHours
        };
        break;
      case 'social':
        groupData = {
          facebook: settings.facebook,
          instagram: settings.instagram,
          youtube: settings.youtube,
          tiktok: settings.tiktok
        };
        break;
      case 'seo':
        groupData = {
          metaTitle: settings.metaTitle,
          metaDescription: settings.metaDescription,
          metaKeywords: settings.metaKeywords
        };
        break;
      case 'footer':
        groupData = {
          footerText: settings.footerText
        };
        break;
      case 'features':
        groupData = {
          features: settings.features
        };
        break;
      default:
        return res.status(400).json({
          message: 'Invalid setting group',
          code: 'INVALID_GROUP'
        });
    }
    
    res.json({
      message: `${group} settings retrieved successfully`,
      data: groupData
    });
  } catch (error) {
    console.error('Get settings group error:', error);
    res.status(500).json({
      message: 'Failed to get settings group',
      error: error.message
    });
  }
});

module.exports = router;

