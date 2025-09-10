const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const TourCategory = require('../models/TourCategory');
const { protect, optionalAuth } = require('../middleware/auth');

// @desc    Debug tours
// @route   GET /api/tours/debug
// @access  Public
router.get('/debug', async (req, res) => {
  try {
    const totalTours = await Tour.countDocuments();
    const tours = await Tour.find().limit(5);
    res.json({
      success: true,
      totalTours,
      sampleTours: tours.map(t => ({
        id: t._id,
        title: t.title.en,
        category: t.category
      }))
    });
  } catch (error) {
    console.error('Debug tours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, featured, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = {};

    if (category) {
      const categoryObj = await TourCategory.findOne({ slug: category });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.vi': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.vi': { $regex: search, $options: 'i' } }
      ];
    }

    const tours = await Tour.find(query)
      .populate('category', 'name slug type')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Tour.countDocuments(query);

    res.json({
      success: true,
      data: tours,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get tour by slug
// @route   GET /api/tours/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug })
      .populate('category', 'name slug type');

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    console.error('Get tour by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get tour by ID
// @route   GET /api/tours/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate('category', 'name slug type');

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      shortDescription,
      category,
      pricing,
      duration,
      location,
      highlights,
      included,
      excluded,
      requirements,
      cancellationPolicy,
      images,
      isActive,
      isFeatured,
      order,
      region,
      difficulty,
      amenities,
      features
    } = req.body;

    // Verify category exists
    const categoryObj = await TourCategory.findById(category);
    if (!categoryObj) {
      return res.status(400).json({ message: 'Invalid tour category' });
    }

    const tour = new Tour({
      title,
      slug,
      description,
      shortDescription,
      category,
      pricing,
      duration,
      location,
      highlights,
      included,
      excluded,
      requirements,
      cancellationPolicy,
      images,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
      order: order || 0,
      region,
      difficulty,
      amenities,
      features
    });

    const createdTour = await tour.save();
    await createdTour.populate('category', 'name slug type');

    res.status(201).json({
      success: true,
      data: createdTour
    });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        tour[key] = req.body[key];
      }
    });

    const updatedTour = await tour.save();
    await updatedTour.populate('category', 'name slug type');

    res.json({
      success: true,
      data: updatedTour
    });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    await Tour.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get featured tours
// @route   GET /api/tours/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const tours = await Tour.find({
      isFeatured: true,
      isActive: true
    })
      .populate('category', 'name slug type')
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: tours
    });
  } catch (error) {
    console.error('Get featured tours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Search tours
// @route   GET /api/tours/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10, category, region, difficulty } = req.query;

    // Build query
    let query = { isActive: true };

    if (q) {
      query.$or = [
        { 'title.en': { $regex: q, $options: 'i' } },
        { 'title.vi': { $regex: q, $options: 'i' } },
        { 'description.en': { $regex: q, $options: 'i' } },
        { 'description.vi': { $regex: q, $options: 'i' } },
        { 'location.en': { $regex: q, $options: 'i' } },
        { 'location.vi': { $regex: q, $options: 'i' } }
      ];
    }

    if (category) {
      const categoryObj = await TourCategory.findOne({ slug: category });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }

    if (region) {
      query.region = region;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const tours = await Tour.find(query)
      .populate('category', 'name slug type')
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: tours
    });
  } catch (error) {
    console.error('Search tours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get tours by category
// @route   GET /api/tours/category/:categorySlug
// @access  Public
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const category = await TourCategory.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const tours = await Tour.find({
      category: category._id,
      isActive: true
    })
      .populate('category', 'name slug type')
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Tour.countDocuments({
      category: category._id,
      isActive: true
    });

    res.json({
      success: true,
      data: tours,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get tours by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get tour types
// @route   GET /api/tours/types
// @access  Public
router.get('/types', async (req, res) => {
  try {
    const tourCategories = await TourCategory.find({ isActive: true })
      .select('name slug description region highlights features amenities')
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: tourCategories
    });
  } catch (error) {
    console.error('Get tour types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
