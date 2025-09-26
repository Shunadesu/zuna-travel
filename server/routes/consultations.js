const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { protect } = require('../middleware/auth');

// @desc    Create new consultation request
// @route   POST /api/consultations
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      preferredContactMethod,
      preferredContactTime,
      travelDates,
      numberOfTravelers,
      budget,
      interests,
      source,
      referrerUrl,
      ipAddress,
      userAgent,
      language,
      tourReference
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, subject, and message are required'
      });
    }

    // Create consultation
    const consultation = new Consultation({
      name,
      email,
      phone,
      subject,
      message,
      preferredContactMethod: preferredContactMethod || 'email',
      preferredContactTime: preferredContactTime || 'anytime',
      travelDates,
      numberOfTravelers: numberOfTravelers || { adults: 1, children: 0 },
      budget: budget || 'under-1000',
      interests: interests || [],
      source: source || 'website',
      referrerUrl,
      ipAddress: ipAddress || req.ip,
      userAgent: userAgent || req.get('User-Agent'),
      language: language || 'en',
      tourReference: tourReference || null
    });

    const savedConsultation = await consultation.save();

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully',
      data: savedConsultation
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all consultations (Admin only)
// @route   GET /api/consultations
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 100, status, priority, source, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const consultations = await Consultation.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Consultation.countDocuments(query);

    res.json({
      success: true,
      data: consultations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get consultation by ID (Admin only)
// @route   GET /api/consultations/:id
// @access  Private/Admin
router.get('/:id', protect, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update consultation status (Admin only)
// @route   PUT /api/consultations/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body;

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Update status
    if (status) {
      consultation.status = status;
    }

    // Update priority
    if (priority) {
      consultation.priority = priority;
    }

    // Add admin notes
    if (adminNotes) {
      consultation.adminNotes.push({
        note: adminNotes,
        addedBy: req.user.id,
        addedAt: new Date()
      });
    }

    // Update last contact time
    consultation.lastContactAt = new Date();

    const updatedConsultation = await consultation.save();

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      data: updatedConsultation
    });
  } catch (error) {
    console.error('Update consultation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add contact history (Admin only)
// @route   POST /api/consultations/:id/contact
// @access  Private/Admin
router.post('/:id/contact', protect, async (req, res) => {
  try {
    const { method, notes } = req.body;

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    // Add contact history
    consultation.contactHistory.push({
      method: method || 'email',
      notes: notes || '',
      contactedBy: req.user.id,
      date: new Date()
    });

    // Update last contact time
    consultation.lastContactAt = new Date();

    // Set first response time if this is the first contact
    if (!consultation.firstResponseAt) {
      consultation.firstResponseAt = new Date();
      const hoursDiff = (new Date() - consultation.createdAt) / (1000 * 60 * 60);
      consultation.responseTime = Math.round(hoursDiff);
    }

    const updatedConsultation = await consultation.save();

    res.json({
      success: true,
      message: 'Contact history added successfully',
      data: updatedConsultation
    });
  } catch (error) {
    console.error('Add contact history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete consultation (Admin only)
// @route   DELETE /api/consultations/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    await Consultation.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get consultation statistics (Admin only)
// @route   GET /api/consultations/stats/overview
// @access  Private/Admin
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const total = await Consultation.countDocuments();
    const newCount = await Consultation.countDocuments({ status: 'new' });
    const contactedCount = await Consultation.countDocuments({ status: 'contacted' });
    const inProgressCount = await Consultation.countDocuments({ status: 'in-progress' });
    const completedCount = await Consultation.countDocuments({ status: 'completed' });

    // Recent consultations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = await Consultation.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Average response time
    const consultationsWithResponseTime = await Consultation.find({
      responseTime: { $exists: true, $ne: null }
    });
    const avgResponseTime = consultationsWithResponseTime.length > 0
      ? consultationsWithResponseTime.reduce((sum, c) => sum + c.responseTime, 0) / consultationsWithResponseTime.length
      : 0;

    res.json({
      success: true,
      data: {
        total,
        byStatus: {
          new: newCount,
          contacted: contactedCount,
          inProgress: inProgressCount,
          completed: completedCount
        },
        recent: recentCount,
        avgResponseTime: Math.round(avgResponseTime)
      }
    });
  } catch (error) {
    console.error('Get consultation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
