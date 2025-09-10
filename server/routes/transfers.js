const express = require('express');
const router = express.Router();
const Transfer = require('../models/Transfer');
const TransferCategory = require('../models/TransferCategory');
const { protect, optionalAuth } = require('../middleware/auth');

// @desc    Get all transfers
// @route   GET /api/transfers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, featured, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = { isActive: true }; // Only return active transfers

    if (category) {
      const categoryObj = await TransferCategory.findOne({ slug: category });
      if (categoryObj) {
        query.category = categoryObj._id;
      } else {
        // If category not found, return empty result
        return res.json({
          success: true,
          data: [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 0,
            pages: 0
          }
        });
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

    const transfers = await Transfer.find(query)
      .populate('category', 'name slug serviceType vehicleType region')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Transfer.countDocuments(query);

    res.json({
      success: true,
      data: transfers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transfer by slug
// @route   GET /api/transfers/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const transfer = await Transfer.findOne({ slug: req.params.slug })
      .populate('category', 'name slug serviceType vehicleType region');

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    res.json({
      success: true,
      data: transfer
    });
  } catch (error) {
    console.error('Get transfer by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transfer by ID
// @route   GET /api/transfers/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate('category', 'name slug serviceType vehicleType region');

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    res.json({
      success: true,
      data: transfer
    });
  } catch (error) {
    console.error('Get transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new transfer
// @route   POST /api/transfers
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
      from,
      to,
      vehicleType,
      seats,
      features,
      amenities,
      included,
      excluded,
      requirements,
      cancellationPolicy,
      images,
      isActive,
      isFeatured,
      order,
      region,
      route,
      distance
    } = req.body;

    // Verify category exists
    const categoryObj = await TransferCategory.findById(category);
    if (!categoryObj) {
      return res.status(400).json({ message: 'Invalid transfer category' });
    }

    const transfer = new Transfer({
      title,
      slug,
      description,
      shortDescription,
      category,
      pricing,
      duration,
      from,
      to,
      vehicleType,
      seats,
      features,
      amenities,
      included,
      excluded,
      requirements,
      cancellationPolicy,
      images,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
      order: order || 0,
      region,
      route,
      distance
    });

    const createdTransfer = await transfer.save();
    await createdTransfer.populate('category', 'name slug serviceType vehicleType region');

    res.status(201).json({
      success: true,
      data: createdTransfer
    });
  } catch (error) {
    console.error('Create transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update transfer
// @route   PUT /api/transfers/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        transfer[key] = req.body[key];
      }
    });

    const updatedTransfer = await transfer.save();
    await updatedTransfer.populate('category', 'name slug serviceType vehicleType region');

    res.json({
      success: true,
      data: updatedTransfer
    });
  } catch (error) {
    console.error('Update transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete transfer
// @route   DELETE /api/transfers/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    await Transfer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Transfer deleted successfully'
    });
  } catch (error) {
    console.error('Delete transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get featured transfers
// @route   GET /api/transfers/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const transfers = await Transfer.find({
      isFeatured: true,
      isActive: true
    })
      .populate('category', 'name slug serviceType vehicleType region')
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: transfers
    });
  } catch (error) {
    console.error('Get featured transfers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Search transfers
// @route   GET /api/transfers/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10, category, region, vehicleType } = req.query;

    // Build query
    let query = { isActive: true };

    if (q) {
      query.$or = [
        { 'title.en': { $regex: q, $options: 'i' } },
        { 'title.vi': { $regex: q, $options: 'i' } },
        { 'description.en': { $regex: q, $options: 'i' } },
        { 'description.vi': { $regex: q, $options: 'i' } },
        { 'from.en': { $regex: q, $options: 'i' } },
        { 'from.vi': { $regex: q, $options: 'i' } },
        { 'to.en': { $regex: q, $options: 'i' } },
        { 'to.vi': { $regex: q, $options: 'i' } }
      ];
    }

    if (category) {
      const categoryObj = await TransferCategory.findOne({ slug: category });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }

    if (region) {
      query.region = region;
    }

    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    const transfers = await Transfer.find(query)
      .populate('category', 'name slug serviceType vehicleType region')
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: transfers
    });
  } catch (error) {
    console.error('Search transfers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transfer types
// @route   GET /api/transfers/types
// @access  Public
router.get('/types', async (req, res) => {
  try {
    const transferCategories = await TransferCategory.find({ isActive: true })
      .select('name slug description vehicleType seats region')
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: transferCategories
    });
  } catch (error) {
    console.error('Get transfer types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get popular routes
// @route   GET /api/transfers/routes/popular
// @access  Public
router.get('/routes/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const popularTransfers = await Transfer.find({
      isActive: true
    })
      .populate('category', 'name slug serviceType vehicleType region')
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: popularTransfers
    });
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get seat options
// @route   GET /api/transfers/seats
// @access  Public
router.get('/seats', async (req, res) => {
  try {
    const seatOptions = await Transfer.distinct('seats', { isActive: true });
    const sortedSeats = seatOptions.sort((a, b) => a - b);

    res.json({
      success: true,
      data: sortedSeats
    });
  } catch (error) {
    console.error('Get seat options error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get transfers by category
// @route   GET /api/transfers/category/:categorySlug
// @access  Public
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const category = await TransferCategory.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const transfers = await Transfer.find({
      category: category._id,
      isActive: true
    })
      .populate('category', 'name slug serviceType vehicleType region')
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Transfer.countDocuments({
      category: category._id,
      isActive: true
    });

    res.json({
      success: true,
      data: transfers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get transfers by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
