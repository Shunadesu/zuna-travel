const express = require('express');
const { body, validationResult } = require('express-validator');
const Settings = require('../models/Settings');
const { protect: authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
      'ETag': `"${settings._id}-${settings.updatedAt ? settings.updatedAt.getTime() : Date.now()}"`,
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
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    res.json({
      message: 'Admin settings retrieved successfully',
      data: settings
    });
  } catch (error) {
    console.error('Get admin settings error:', error);
    res.status(500).json({
      message: 'Failed to get admin settings',
      error: error.message
    });
  }
});

// Update settings
router.put('/', authenticateToken, [
  body('companyName').optional().isObject(),
  body('companyName.en').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('companyName.vi').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('companyDescription').optional().isObject(),
  body('companyDescription.en').optional().isString().trim().isLength({ max: 500 }),
  body('companyDescription.vi').optional().isString().trim().isLength({ max: 500 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isString().trim(),
  body('whatsapp').optional().isString().trim(),
  body('address').optional().isObject(),
  body('address.en').optional().isString().trim(),
  body('address.vi').optional().isString().trim(),
  body('businessHours').optional().isObject(),
  body('businessHours.en').optional().isString().trim(),
  body('businessHours.vi').optional().isString().trim(),
  body('primaryColor').optional().isString().trim(),
  body('secondaryColor').optional().isString().trim(),
  body('facebook').optional().isURL(),
  body('instagram').optional().isURL(),
  body('youtube').optional().isURL(),
  body('tiktok').optional().isURL(),
  body('metaTitle').optional().isObject(),
  body('metaTitle.en').optional().isString().trim().isLength({ max: 60 }),
  body('metaTitle.vi').optional().isString().trim().isLength({ max: 60 }),
  body('metaDescription').optional().isObject(),
  body('metaDescription.en').optional().isString().trim().isLength({ max: 160 }),
  body('metaDescription.vi').optional().isString().trim().isLength({ max: 160 }),
  body('metaKeywords').optional().isArray(),
  body('footerText').optional().isObject(),
  body('footerText.en').optional().isString().trim(),
  body('footerText.vi').optional().isString().trim(),
  body('features').optional().isObject(),
  body('features.enableBooking').optional().isBoolean(),
  body('features.enableReviews').optional().isBoolean(),
  body('features.enableNewsletter').optional().isBoolean(),
  body('features.enableSocialLogin').optional().isBoolean(),
  body('features.maintenanceMode').optional().isBoolean(),
  body('googleAnalyticsId').optional().isString().trim(),
  body('facebookPixelId').optional().isString().trim(),
  body('topBar').optional().isObject(),
  body('topBar.backgroundColor').optional().isString().trim(),
  body('topBar.textColor').optional().isString().trim(),
  body('topBar.hoverColor').optional().isString().trim(),
  body('footer').optional().isObject(),
  body('footer.backgroundColor').optional().isString().trim(),
  body('footer.textColor').optional().isString().trim(),
  body('footer.secondaryTextColor').optional().isString().trim(),
  body('footer.borderColor').optional().isString().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const settings = await Settings.getSettings();
    
    // Update only provided fields
    const updateData = {};
    const allowedFields = [
      'companyName', 'companyDescription', 'email', 'phone', 'whatsapp',
      'address', 'businessHours', 'primaryColor', 'secondaryColor',
      'facebook', 'instagram', 'youtube', 'tiktok', 'metaTitle',
      'metaDescription', 'metaKeywords', 'footerText', 'features',
      'googleAnalyticsId', 'facebookPixelId', 'topBar', 'footer'
    ];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    // Ensure settings is a Mongoose document
    if (!settings || typeof settings.save !== 'function') {
      throw new Error('Settings object is not a valid Mongoose document');
    }
    
    Object.assign(settings, updateData);
    await settings.save();
    
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

// Reset settings to defaults
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    // Reset to default values
    const defaultSettings = new Settings();
    Object.assign(settings, defaultSettings.toObject());
    
    // Ensure settings is a Mongoose document
    if (!settings || typeof settings.save !== 'function') {
      throw new Error('Settings object is not a valid Mongoose document');
    }
    
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

