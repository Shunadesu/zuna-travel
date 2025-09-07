const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect: authenticateToken, admin: requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all tours (public with optional auth)
router.get('/', optionalAuth, [
  query('category').optional().isMongoId().withMessage('Invalid category ID'),
  query('featured').optional().isBoolean(),
  query('active').optional().isBoolean(),
  query('search').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sortBy').optional().isIn(['createdAt', 'title', 'price', 'rating', 'duration']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      category,
      featured,
      active,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20,
      page = 1
    } = req.query;

    // Get all tour categories
    const tourCategories = await Category.find({ type: 'vietnam-tours' });
    
    if (tourCategories.length === 0) {
      return res.json({
        message: 'Tours retrieved successfully',
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0
        }
      });
    }

    // Build query - only get products from tour categories
    const query = {
      category: { $in: tourCategories.map(cat => cat._id) }
    };
    
    // For public access, only show active products unless user is admin
    if (!req.user || req.user.role !== 'admin') {
      query.isActive = true;
    } else if (active !== undefined) {
      query.isActive = active === 'true';
    }

    if (category) {
      // If specific category is requested, filter by that category
      query.category = category;
    }
    
    if (featured !== undefined) query.isFeatured = featured === 'true';

    // Price filter
    if (minPrice || maxPrice) {
      query['pricing.adult'] = {};
      if (minPrice) query['pricing.adult'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.adult'].$lte = parseFloat(maxPrice);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    if (search) {
      sort.score = { $meta: 'textScore' };
    }
    if (sortBy === 'price') {
      sort['pricing.adult'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'rating') {
      sort['rating.average'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'title') {
      sort['title.en'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'duration') {
      sort['duration.days'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const tours = await Product.find(query)
      .populate('category', 'name slug type')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
      'ETag': `"tours-${total}-${Date.now()}"`,
      'Vary': 'Accept-Encoding'
    });

    res.json({
      message: 'Tours retrieved successfully',
      data: tours,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tours error:', error);
    res.status(500).json({
      message: 'Failed to get tours',
      error: error.message
    });
  }
});

// Get tour by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Get all tour categories
    const tourCategories = await Category.find({ type: 'vietnam-tours' });
    
    const tour = await Product.findOne({ 
      slug, 
      isActive: true,
      category: { $in: tourCategories.map(cat => cat._id) }
    })
      .populate('category', 'name slug type');
    
    if (!tour) {
      return res.status(404).json({
        message: 'Tour not found',
        code: 'TOUR_NOT_FOUND'
      });
    }

    res.json({
      message: 'Tour retrieved successfully',
      data: tour
    });
  } catch (error) {
    console.error('Get tour by slug error:', error);
    res.status(500).json({
      message: 'Failed to get tour',
      error: error.message
    });
  }
});

// Get tour by ID (admin)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get all tour categories
    const tourCategories = await Category.find({ type: 'vietnam-tours' });
    
    const tour = await Product.findById(id)
      .populate('category', 'name slug type');
    
    if (!tour) {
      return res.status(404).json({
        message: 'Tour not found',
        code: 'TOUR_NOT_FOUND'
      });
    }

    // Check if this product is actually a tour
    if (!tourCategories.some(cat => cat._id.toString() === tour.category._id.toString())) {
      return res.status(404).json({
        message: 'Tour not found',
        code: 'TOUR_NOT_FOUND'
      });
    }

    res.json({
      message: 'Tour retrieved successfully',
      data: tour
    });
  } catch (error) {
    console.error('Get tour error:', error);
    res.status(500).json({
      message: 'Failed to get tour',
      error: error.message
    });
  }
});

// Create tour (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('title.en').trim().notEmpty().withMessage('English title is required'),
  body('title.vi').trim().notEmpty().withMessage('Vietnamese title is required'),
  body('description.en').notEmpty().withMessage('English description is required'),
  body('description.vi').notEmpty().withMessage('Vietnamese description is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('pricing.adult').optional().isFloat({ min: 0 }).withMessage('Adult price must be a positive number'),
  body('pricing.child').optional().isFloat({ min: 0 }).withMessage('Child price must be a positive number'),
  body('pricing.currency').optional().isIn(['USD', 'VND']).withMessage('Currency must be USD or VND'),
  body('duration.days').optional().isInt({ min: 1 }).withMessage('Duration days must be at least 1'),
  body('duration.nights').optional().isInt({ min: 0 }).withMessage('Duration nights cannot be negative'),
  body('images').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const tourData = req.body;

    // Verify category exists and is a tour category
    const category = await Category.findById(tourData.category);
    if (!category) {
      return res.status(400).json({
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    if (category.type !== 'vietnam-tours') {
      return res.status(400).json({
        message: 'Category must be a tour category',
        code: 'INVALID_CATEGORY_TYPE'
      });
    }

    // Generate slug from English title
    const slug = tourData.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingTour = await Product.findOne({ slug });
    if (existingTour) {
      return res.status(400).json({
        message: 'Tour with this title already exists',
        code: 'SLUG_EXISTS'
      });
    }

    const tour = new Product({
      ...tourData,
      slug
    });

    await tour.save();
    await tour.populate('category', 'name slug type');

    res.status(201).json({
      message: 'Tour created successfully',
      data: tour
    });
  } catch (error) {
    console.error('Create tour error:', error);
    res.status(500).json({
      message: 'Failed to create tour',
      error: error.message
    });
  }
});

// Update tour (admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('title.en').optional().trim().notEmpty().withMessage('English title cannot be empty'),
  body('title.vi').optional().trim().notEmpty().withMessage('Vietnamese title cannot be empty'),
  body('description.en').optional().notEmpty().withMessage('English description cannot be empty'),
  body('description.vi').optional().notEmpty().withMessage('Vietnamese description cannot be empty'),
  body('category').optional().isMongoId().withMessage('Valid category ID is required'),
  body('pricing.adult').optional().isFloat({ min: 0 }).withMessage('Adult price must be a positive number'),
  body('pricing.child').optional().isFloat({ min: 0 }).withMessage('Child price must be a positive number'),
  body('pricing.currency').optional().isIn(['USD', 'VND']).withMessage('Currency must be USD or VND'),
  body('duration.days').optional().isInt({ min: 1 }).withMessage('Duration days must be at least 1'),
  body('duration.nights').optional().isInt({ min: 0 }).withMessage('Duration nights cannot be negative'),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
  body('images').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const tour = await Product.findById(id);
    if (!tour) {
      return res.status(404).json({
        message: 'Tour not found',
        code: 'TOUR_NOT_FOUND'
      });
    }

    // Verify category if being updated
    if (updateData.category) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        return res.status(400).json({
          message: 'Category not found',
          code: 'CATEGORY_NOT_FOUND'
        });
      }

      if (category.type !== 'vietnam-tours') {
        return res.status(400).json({
          message: 'Category must be a tour category',
          code: 'INVALID_CATEGORY_TYPE'
        });
      }
    }

    // Update slug if English title is changed
    if (updateData.title?.en && updateData.title.en !== tour.title.en) {
      const newSlug = updateData.title.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists
      const existingTour = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingTour) {
        return res.status(400).json({
          message: 'Tour with this title already exists',
          code: 'SLUG_EXISTS'
        });
      }

      updateData.slug = newSlug;
    }

    Object.assign(tour, updateData);
    await tour.save();
    await tour.populate('category', 'name slug type');

    res.json({
      message: 'Tour updated successfully',
      data: tour
    });
  } catch (error) {
    console.error('Update tour error:', error);
    res.status(500).json({
      message: 'Failed to update tour',
      error: error.message
    });
  }
});

// Delete tour (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Product.findById(id);
    if (!tour) {
      return res.status(404).json({
        message: 'Tour not found',
        code: 'TOUR_NOT_FOUND'
      });
    }

    // Check if this is actually a tour
    const tourCategories = await Category.find({ type: 'vietnam-tours' });
    if (!tourCategories.some(cat => cat._id.toString() === tour.category.toString())) {
      return res.status(404).json({
        message: 'Tour not found',
        code: 'TOUR_NOT_FOUND'
      });
    }

    await Product.findByIdAndDelete(id);

    res.json({
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    console.error('Delete tour error:', error);
    res.status(500).json({
      message: 'Failed to delete tour',
      error: error.message
    });
  }
});

// Get featured tours (public)
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    // Get all tour categories
    const tourCategories = await Category.find({ type: 'vietnam-tours' });

    const tours = await Product.find({ 
      isActive: true, 
      isFeatured: true,
      category: { $in: tourCategories.map(cat => cat._id) }
    })
      .populate('category', 'name slug type')
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      message: 'Featured tours retrieved successfully',
      data: tours
    });
  } catch (error) {
    console.error('Get featured tours error:', error);
    res.status(500).json({
      message: 'Failed to get featured tours',
      error: error.message
    });
  }
});

// Search tours (public)
router.get('/search/text', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('category').optional().isMongoId(),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { q, category, limit = 10 } = req.query;

    // Get all tour categories
    const tourCategories = await Category.find({ type: 'vietnam-tours' });

    const query = {
      $text: { $search: q },
      isActive: true,
      category: { $in: tourCategories.map(cat => cat._id) }
    };

    if (category) query.category = category;

    const tours = await Product.find(query, { score: { $meta: 'textScore' } })
      .populate('category', 'name slug type')
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json({
      message: 'Search results retrieved successfully',
      data: tours,
      query: q
    });
  } catch (error) {
    console.error('Search tours error:', error);
    res.status(500).json({
      message: 'Failed to search tours',
      error: error.message
    });
  }
});

module.exports = router;
