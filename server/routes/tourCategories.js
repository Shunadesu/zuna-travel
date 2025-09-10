const express = require('express');
const router = express.Router();
const TourCategory = require('../models/TourCategory');
const { protect, optionalAuth } = require('../middleware/auth');

// @desc    Get all tour categories
// @route   GET /api/tour-categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, featured, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = {};

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.vi': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.vi': { $regex: search, $options: 'i' } }
      ];
    }

    const categories = await TourCategory.find(query)
      .sort({ order: 1, name: 1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await TourCategory.countDocuments(query);

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
    console.error('Get tour categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get tour category by slug
// @route   GET /api/tour-categories/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const category = await TourCategory.findOne({ 
      slug: req.params.slug
    });

    if (!category) {
      return res.status(404).json({ message: 'Tour category not found' });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get tour category by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get tour category by ID
// @route   GET /api/tour-categories/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const category = await TourCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Tour category not found' });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get tour category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new tour category
// @route   POST /api/tour-categories
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
      region,
      duration,
      difficulty,
      highlights,
      slug
    } = req.body;

    const category = new TourCategory({
      name,
      description,
      slug: slug || name?.en?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      type: 'vietnam-tours',
      images: images ? images.map(img => ({
        url: img.url,
        alt: img.alt || name?.en || '',
        caption: img.caption || ''
      })) : (image ? [{ url: image, alt: name?.en || '', caption: '' }] : []),
      featured: featured || false,
      order: order || 0,
      region: region || '',
      duration: duration || '',
      difficulty: difficulty || '',
      highlights: highlights || [],
      features: req.body.features || [],
      amenities: req.body.amenities || []
    });

    const createdCategory = await category.save();

    res.status(201).json({
      success: true,
      data: createdCategory
    });
  } catch (error) {
    console.error('Create tour category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update tour category
// @route   PUT /api/tour-categories/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const category = await TourCategory.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Tour category not found' });
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
    console.error('Update tour category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete tour category
// @route   DELETE /api/tour-categories/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await TourCategory.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Tour category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tour category deleted successfully'
    });
  } catch (error) {
    console.error('Delete tour category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get featured tour categories
// @route   GET /api/tour-categories/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const categories = await TourCategory.find({
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
    console.error('Get featured tour categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get tour categories by region
// @route   GET /api/tour-categories/region/:region
// @access  Public
router.get('/region/:region', async (req, res) => {
  try {
    const categories = await Category.find({
      type: 'vietnam-tours',
      region: req.params.region
    })
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get tour categories by region error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all regions
// @route   GET /api/tour-categories/regions
// @access  Public
router.get('/regions', async (req, res) => {
  try {
    const regions = await Category.distinct('region', { type: 'vietnam-tours' });
    
    res.json({
      success: true,
      data: regions.filter(region => region) // Remove null/undefined values
    });
  } catch (error) {
    console.error('Get tour regions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
