const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect: authenticateToken, admin: requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all transfer services (public with optional auth)
router.get('/', optionalAuth, async (req, res) => {
  try {

    const {
      type,
      seats,
      departure,
      destination,
      minPrice,
      maxPrice,
      active,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20,
      page = 1
    } = req.query;

    // Build query - get products with transfer-services category type
    const query = {
      'category.type': 'transfer-services'
    };

    // For public access, only show active transfers unless user is admin
    if (!req.user || req.user.role !== 'admin') {
      query.isActive = true;
    } else if (active !== undefined) {
      query.isActive = active === 'true';
    }

    if (featured !== undefined) query.isFeatured = featured === 'true';

    // Simple filters - only use what exists in current data structure
    if (type) query['category.slug'] = type;
    if (seats) query['category.seats'] = { $gte: parseInt(seats) };

    // Price filter
    if (minPrice || maxPrice) {
      query['pricing.adult'] = {};
      if (minPrice) query['pricing.adult'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.adult'].$lte = parseFloat(maxPrice);
    }

    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    if (sortBy === 'price') {
      sort['pricing.adult'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'seats') {
      sort['category.seats'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'rating') {
      sort['rating.average'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'title') {
      sort['title.en'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const transfers = await Product.find(query)
      .populate('category', 'name slug type')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
      'ETag': `"transfers-${total}-${Date.now()}"`,
      'Vary': 'Accept-Encoding'
    });

    res.json({
      message: 'Transfer services retrieved successfully',
      data: transfers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transfer services error:', error);
    res.status(500).json({
      message: 'Failed to get transfer services',
      error: error.message
    });
  }
});

// Get transfer service types (public)
router.get('/types', async (req, res) => {
  try {
    const types = [
      { value: 'luxury-limo', label: { en: 'Luxury LIMO', vi: 'LIMO Cao Cấp' } },
      { value: 'sharing-bus', label: { en: 'Sharing Bus', vi: 'Xe Buýt Chia Sẻ' } },
      { value: 'private-car', label: { en: 'Private Car', vi: 'Xe Riêng' } },
      { value: 'shuttle-bus', label: { en: 'Shuttle Bus', vi: 'Xe Đưa Đón' } },
      { value: 'private-limo', label: { en: 'Private LIMO', vi: 'LIMO Riêng' } },
      { value: 'sleeping-bus', label: { en: 'Sleeping Bus', vi: 'Xe Giường Nằm' } },
      { value: 'airport-transfer', label: { en: 'Airport Transfer', vi: 'Đưa Đón Sân Bay' } },
      { value: 'city-transfer', label: { en: 'City Transfer', vi: 'Đưa Đón Trong Thành Phố' } },
      { value: 'intercity-transfer', label: { en: 'Intercity Transfer', vi: 'Đưa Đón Liên Tỉnh' } }
    ];

    res.json({
      message: 'Transfer service types retrieved successfully',
      data: types
    });
  } catch (error) {
    console.error('Get transfer types error:', error);
    res.status(500).json({
      message: 'Failed to get transfer types',
      error: error.message
    });
  }
});

// Get seat options (public)
router.get('/seats', async (req, res) => {
  try {
    const seatOptions = [
      { value: 4, label: '4-seats' },
      { value: 7, label: '7-seats' },
      { value: 9, label: 'LIMO 9 seat' },
      { value: 16, label: '16-seats' },
      { value: 45, label: '45 seat' }
    ];

    res.json({
      message: 'Seat options retrieved successfully',
      data: seatOptions
    });
  } catch (error) {
    console.error('Get seat options error:', error);
    res.status(500).json({
      message: 'Failed to get seat options',
      error: error.message
    });
  }
});

// Search transfers by route
router.get('/search', [
  query('from').notEmpty().withMessage('Departure location is required'),
  query('to').notEmpty().withMessage('Destination is required'),
  query('date').optional().isISO8601().withMessage('Invalid date format'),
  query('passengers').optional().isInt({ min: 1, max: 45 }).withMessage('Invalid passenger count'),
  query('type').optional().isIn([
    'luxury-limo', 'sharing-bus', 'private-car', 'shuttle-bus', 
    'private-limo', 'sleeping-bus', 'airport-transfer', 'city-transfer', 'intercity-transfer'
  ])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { from, to, date, passengers, type } = req.query;

    // Get transfer services category
    const transferCategory = await Category.findOne({ type: 'transfer-services' });
    if (!transferCategory) {
      return res.status(404).json({
        message: 'Transfer services category not found'
      });
    }

    // Build search query
    const query = {
      category: transferCategory._id,
      isActive: true,
      $and: [
        {
          $or: [
            { 'transferService.route.departure.en': new RegExp(from, 'i') },
            { 'transferService.route.departure.vi': new RegExp(from, 'i') }
          ]
        },
        {
          $or: [
            { 'transferService.route.destination.en': new RegExp(to, 'i') },
            { 'transferService.route.destination.vi': new RegExp(to, 'i') }
          ]
        }
      ]
    };

    if (passengers) {
      query['transferService.seats'] = { $gte: parseInt(passengers) };
    }

    if (type) {
      query['transferService.type'] = type;
    }

    const transfers = await Product.find(query)
      .populate('category', 'name slug type')
      .sort({ 'pricing.perTrip': 1 });

    res.json({
      message: 'Transfer search results retrieved successfully',
      data: transfers,
      searchParams: { from, to, date, passengers, type },
      count: transfers.length
    });
  } catch (error) {
    console.error('Search transfers error:', error);
    res.status(500).json({
      message: 'Failed to search transfers',
      error: error.message
    });
  }
});

// Get transfer service by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const transfer = await Product.findOne({ 
      slug, 
      isActive: true 
    }).populate('category', 'name slug type');
    
    if (!transfer || transfer.category.type !== 'transfer-services') {
      return res.status(404).json({
        message: 'Transfer service not found',
        code: 'TRANSFER_NOT_FOUND'
      });
    }

    res.json({
      message: 'Transfer service retrieved successfully',
      data: transfer
    });
  } catch (error) {
    console.error('Get transfer by slug error:', error);
    res.status(500).json({
      message: 'Failed to get transfer service',
      error: error.message
    });
  }
});

// Get popular routes (public)
router.get('/routes/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get transfer services category
    const transferCategory = await Category.findOne({ type: 'transfer-services' });
    if (!transferCategory) {
      return res.status(404).json({
        message: 'Transfer services category not found'
      });
    }

    // Aggregate popular routes
    const popularRoutes = await Product.aggregate([
      {
        $match: {
          category: transferCategory._id,
          isActive: true,
          'transferService.route.departure.en': { $exists: true },
          'transferService.route.destination.en': { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            departure: '$transferService.route.departure',
            destination: '$transferService.route.destination'
          },
          count: { $sum: 1 },
          minPrice: { $min: '$pricing.perTrip' },
          avgPrice: { $avg: '$pricing.perTrip' },
          services: { $push: {
            _id: '$_id',
            title: '$title',
            slug: '$slug',
            price: '$pricing.perTrip',
            seats: '$transferService.seats',
            type: '$transferService.type'
          }}
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({
      message: 'Popular routes retrieved successfully',
      data: popularRoutes
    });
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({
      message: 'Failed to get popular routes',
      error: error.message
    });
  }
});

// Create transfer service (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('title.en').trim().notEmpty().withMessage('English title is required'),
  body('title.vi').trim().notEmpty().withMessage('Vietnamese title is required'),
  body('transferService.type').isIn([
    'luxury-limo', 'sharing-bus', 'private-car', 'shuttle-bus', 
    'private-limo', 'sleeping-bus', 'airport-transfer', 'city-transfer', 'intercity-transfer'
  ]).withMessage('Invalid transfer service type'),
  body('transferService.seats').isInt({ min: 1, max: 45 }).withMessage('Seats must be between 1 and 45'),
  body('pricing.perTrip').optional().isFloat({ min: 0 }).withMessage('Per trip price must be positive'),
  body('transferService.route.departure.en').trim().notEmpty().withMessage('Departure location (English) is required'),
  body('transferService.route.departure.vi').trim().notEmpty().withMessage('Departure location (Vietnamese) is required'),
  body('transferService.route.destination.en').trim().notEmpty().withMessage('Destination (English) is required'),
  body('transferService.route.destination.vi').trim().notEmpty().withMessage('Destination (Vietnamese) is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get transfer services category
    const transferCategory = await Category.findOne({ type: 'transfer-services' });
    if (!transferCategory) {
      return res.status(400).json({
        message: 'Transfer services category not found'
      });
    }

    const transferData = {
      ...req.body,
      category: transferCategory._id
    };

    // Generate slug from English title
    const slug = transferData.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingTransfer = await Product.findOne({ slug });
    if (existingTransfer) {
      return res.status(400).json({
        message: 'Transfer service with this title already exists',
        code: 'SLUG_EXISTS'
      });
    }

    const transfer = new Product({
      ...transferData,
      slug
    });

    await transfer.save();
    await transfer.populate('category', 'name slug type');

    res.status(201).json({
      message: 'Transfer service created successfully',
      data: transfer
    });
  } catch (error) {
    console.error('Create transfer service error:', error);
    res.status(500).json({
      message: 'Failed to create transfer service',
      error: error.message
    });
  }
});

module.exports = router;
