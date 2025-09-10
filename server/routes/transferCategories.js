const express = require('express');
const router = express.Router();
const TransferCategory = require('../models/TransferCategory');
const { protect, optionalAuth } = require('../middleware/auth');

// @desc    Get all transfer categories
// @route   GET /api/transfer-categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, featured, search, vehicleType, region } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = {};

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    if (region) {
      query.region = region;
    }

    // New serviceType filter
    if (req.query.serviceType) {
      query.serviceType = req.query.serviceType;
    }

    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.vi': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.vi': { $regex: search, $options: 'i' } }
      ];
    }

    const categories = await TransferCategory.find(query)
      .sort({ order: 1, name: 1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await TransferCategory.countDocuments(query);

    res.json({
      success: true,
      data: categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get transfer categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transfer category by slug
// @route   GET /api/transfer-categories/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const category = await TransferCategory.findOne({ 
      slug: req.params.slug, 
      type: 'transfer-services' 
    });

    if (!category) {
      return res.status(404).json({ message: 'Transfer category not found' });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get transfer category by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transfer category by ID
// @route   GET /api/transfer-categories/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const category = await TransferCategory.findOne({ 
      _id: req.params.id, 
      type: 'transfer-services' 
    });

    if (!category) {
      return res.status(404).json({ message: 'Transfer category not found' });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get transfer category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new transfer category
// @route   POST /api/transfer-categories
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      images,
      featured,
      order,
      vehicleType,
      seats,
      region,
      amenities,
      features,
      slug,
      serviceType,
      route,
      pricing
    } = req.body;

    const category = new TransferCategory({
      name,
      description,
      slug: slug || name?.en?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      shortDescription: req.body.shortDescription || {
        en: description?.en?.substring(0, 200) || '',
        vi: description?.vi?.substring(0, 200) || ''
      },
      type: 'transfer-services',
      images: images ? images.map(img => ({
        url: img.url,
        alt: img.alt || name?.en || '',
        caption: img.caption || ''
      })) : (image ? [{ url: image, alt: name?.en || '', caption: '' }] : []),
      featured: featured || false,
      order: order || 0,
      vehicleType: vehicleType || 'car',
      region: region || 'all',
      serviceType: serviceType || 'private',
      route: route || {
        from: { en: 'Hanoi', vi: 'Hà Nội' },
        to: { en: 'Airport', vi: 'Sân bay' }
      },
      pricing: pricing || {
        basePrice: 50,
        currency: 'USD'
      },
      amenities: amenities || [],
      features: features || []
    });

    const createdCategory = await category.save();

    res.status(201).json({
      success: true,
      data: createdCategory
    });
  } catch (error) {
    console.error('Create transfer category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update transfer category
// @route   PUT /api/transfer-categories/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const category = await TransferCategory.findOne({ 
      _id: req.params.id, 
      type: 'transfer-services' 
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Transfer category not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        if (key === 'images' && Array.isArray(req.body[key])) {
          // Map images to correct format
          category[key] = req.body[key].map(img => ({
            url: img.url,
            alt: img.alt || category.name?.en || '',
            caption: img.caption || ''
          }));
        } else {
          category[key] = req.body[key];
        }
      }
    });

    const updatedCategory = await category.save();

    res.json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.error('Update transfer category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete transfer category
// @route   DELETE /api/transfer-categories/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await TransferCategory.findOne({ 
      _id: req.params.id, 
      type: 'transfer-services' 
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Transfer category not found' });
    }

    await TransferCategory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transfer category deleted successfully'
    });
  } catch (error) {
    console.error('Delete transfer category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get featured transfer categories
// @route   GET /api/transfer-categories/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const categories = await TransferCategory.find({
      isFeatured: true,
      isActive: true
    })
      .sort({ order: 1, name: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get featured transfer categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transfer categories by vehicle type
// @route   GET /api/transfer-categories/vehicle/:vehicleType
// @access  Public
router.get('/vehicle/:vehicleType', async (req, res) => {
  try {
    const categories = await TransferCategory.find({
      type: 'transfer-services',
      vehicleType: req.params.vehicleType
    })
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get transfer categories by vehicle type error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transfer categories by region
// @route   GET /api/transfer-categories/region/:region
// @access  Public
router.get('/region/:region', async (req, res) => {
  try {
    const categories = await TransferCategory.find({
      type: 'transfer-services',
      region: req.params.region
    })
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get transfer categories by region error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all vehicle types
// @route   GET /api/transfer-categories/vehicle-types
// @access  Public
router.get('/vehicle-types', async (req, res) => {
  try {
    const vehicleTypes = await TransferCategory.distinct('vehicleType');
    
    res.json({
      success: true,
      data: vehicleTypes.filter(type => type) // Remove null/undefined values
    });
  } catch (error) {
    console.error('Get transfer vehicle types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all regions
// @route   GET /api/transfer-categories/regions
// @access  Public
router.get('/regions', async (req, res) => {
  try {
    const regions = await TransferCategory.distinct('region');
    
    res.json({
      success: true,
      data: regions.filter(region => region) // Remove null/undefined values
    });
  } catch (error) {
    console.error('Get transfer regions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all service types
// @route   GET /api/transfer-categories/service-types
// @access  Public
router.get('/service-types', async (req, res) => {
  try {
    const serviceTypes = await TransferCategory.distinct('serviceType');
    
    res.json({
      success: true,
      data: serviceTypes.filter(type => type)
    });
  } catch (error) {
    console.error('Get service types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all vehicle types
// @route   GET /api/transfer-categories/vehicle-types
// @access  Public
router.get('/vehicle-types', async (req, res) => {
  try {
    const vehicleTypes = await TransferCategory.distinct('vehicleType');
    
    res.json({
      success: true,
      data: vehicleTypes.filter(type => type)
    });
  } catch (error) {
    console.error('Get vehicle types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get categories by service type
// @route   GET /api/transfer-categories/service/:serviceType
// @access  Public
router.get('/service/:serviceType', async (req, res) => {
  try {
    const { serviceType } = req.params;
    const { featured, region } = req.query;
    
    let query = { serviceType, isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (region) {
      query.region = region;
    }
    
    const categories = await TransferCategory.find(query)
      .sort({ order: 1, name: 1 });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories by service type error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get popular routes
// @route   GET /api/transfer-categories/routes/popular
// @access  Public
router.get('/routes/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const popularRoutes = await TransferCategory.find({ 
      isActive: true,
      'route.from.en': { $exists: true },
      'route.to.en': { $exists: true }
    })
    .select('name route serviceType vehicleType pricing')
    .sort({ order: 1 })
    .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: popularRoutes
    });
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
