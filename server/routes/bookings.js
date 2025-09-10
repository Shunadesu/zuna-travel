const express = require('express');
const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Transfer = require('../models/Transfer');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper function to populate product based on type
const populateProduct = async (booking) => {
  if (booking.productType === 'tour') {
    await booking.populate({
      path: 'productId',
      model: 'Tour',
      populate: {
        path: 'category',
        model: 'TourCategory'
      }
    });
  } else if (booking.productType === 'transfer') {
    await booking.populate({
      path: 'productId',
      model: 'Transfer',
      populate: {
        path: 'category',
        model: 'TransferCategory'
      }
    });
  } else {
    // Fallback to Product model
    await booking.populate({
      path: 'productId',
      model: 'Product',
      populate: {
        path: 'category',
        model: 'Category'
      }
    });
  }
  return booking;
};

// Helper function to populate multiple bookings
const populateBookings = async (bookings) => {
  for (let booking of bookings) {
    await populateProduct(booking);
  }
  return bookings;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public (with optional auth)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      productId,
      productType,
      travelers,
      travelDate,
      totalPrice,
      customerInfo,
      tourDetails,
      transferDetails,
      specialRequests
    } = req.body;

    // Validate product exists based on type
    let product;
    if (productType === 'tour') {
      product = await Tour.findById(productId);
    } else if (productType === 'transfer') {
      product = await Transfer.findById(productId);
    } else {
      return res.status(400).json({ message: 'Invalid product type. Must be tour or transfer.' });
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate required fields
    if (!customerInfo || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({ 
        message: 'Customer information (email, phone) is required' 
      });
    }

    if (!travelDate) {
      return res.status(400).json({ 
        message: 'Travel date is required' 
      });
    }

    // Create booking data
    const bookingData = {
      productId,
      productType,
      travelers,
      travelDate: new Date(travelDate),
      totalPrice,
      customerInfo,
      tourDetails,
      transferDetails,
      specialRequests
    };

    // Add user info if authenticated
    if (req.user) {
      bookingData.user = req.user._id;
    }

    const booking = await Booking.create(bookingData);
    
    // Populate product details
    await populateProduct(booking);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Populate products
    await populateBookings(bookings);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone');
    
    if (booking) {
      await populateProduct(booking);
    }

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user && booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user && booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Only allow certain fields to be updated
    const allowedUpdates = [
      'specialRequests', 
      'pickupLocation', 
      'dropoffLocation', 
      'emergencyContact',
      'customerNotes'
    ];

    // Admin can update status
    if (req.user.role === 'admin') {
      allowedUpdates.push('status');
    }

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('productId');

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user && booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancellationDate = new Date();

    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get guest booking by email or phone
// @route   GET /api/bookings/guest/:email
// @access  Public
router.get('/guest/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { phone } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let query = {};
    
    if (phone) {
      // Search by phone number
      query = { 'customerInfo.phone': phone };
    } else {
      // Search by email
      query = { 'customerInfo.email': email };
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Populate products
    await populateBookings(bookings);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get guest bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const productType = req.query.productType;

    const query = {};
    if (status) query.status = status;
    if (productType) query.productType = productType;
    
         // Search functionality
     if (req.query.search) {
       const searchRegex = new RegExp(req.query.search, 'i');
       query.$or = [
         { 'customerInfo.name': searchRegex },
         { 'customerInfo.email': searchRegex },
         { 'customerInfo.phone': searchRegex },
         { 'tourDetails.name': searchRegex },
         { 'transferDetails.name': searchRegex }
       ];
     }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Populate products
    await populateBookings(bookings);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
