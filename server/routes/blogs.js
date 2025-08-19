const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Blog = require('../models/Blog');
const { protect: authenticateToken, admin: requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all blogs (public with optional auth)
router.get('/', optionalAuth, [
  query('published').optional().isBoolean(),
  query('featured').optional().isBoolean(),
  query('category').optional().isIn(['travel-tips', 'destinations', 'food-culture', 'news', 'guides']),
  query('author').optional().isMongoId(),
  query('search').optional().trim(),
  query('sortBy').optional().isIn(['createdAt', 'publishedAt', 'title', 'views']),
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
      published,
      featured,
      category,
      author,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      limit = 20,
      page = 1
    } = req.query;

    // Build query
    const query = {};
    
    // For public access, only show published blogs unless user is admin
    if (!req.user || req.user.role !== 'admin') {
      query.isPublished = true;
    } else if (published !== undefined) {
      query.isPublished = published === 'true';
    }

    if (featured !== undefined) query.isFeatured = featured === 'true';
    if (category) query.categories = { $in: [category] };
    if (author) query.author = author;

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
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Blog.countDocuments(query);

    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
      'ETag': `"blogs-${total}-${Date.now()}"`,
      'Vary': 'Accept-Encoding'
    });

    res.json({
      message: 'Blogs retrieved successfully',
      data: blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      message: 'Failed to get blogs',
      error: error.message
    });
  }
});

// Get blog by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const blog = await Blog.findOne({ slug, isPublished: true })
      .populate('author', 'name email avatar')
      .populate('relatedPosts', 'title slug excerpt featuredImage publishedAt');
    
    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
        code: 'BLOG_NOT_FOUND'
      });
    }

    // Increment views
    await blog.incrementViews();

    res.json({
      message: 'Blog retrieved successfully',
      data: blog
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({
      message: 'Failed to get blog',
      error: error.message
    });
  }
});

// Get blog by ID (admin)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id)
      .populate('author', 'name email avatar')
      .populate('relatedPosts', 'title slug excerpt featuredImage publishedAt');
    
    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
        code: 'BLOG_NOT_FOUND'
      });
    }

    res.json({
      message: 'Blog retrieved successfully',
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      message: 'Failed to get blog',
      error: error.message
    });
  }
});

// Create blog (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('title.en').trim().notEmpty().withMessage('English title is required'),
  body('title.vi').trim().notEmpty().withMessage('Vietnamese title is required'),
  body('content.en').notEmpty().withMessage('English content is required'),
  body('content.vi').notEmpty().withMessage('Vietnamese content is required'),
  body('excerpt.en').optional().isLength({ max: 300 }).withMessage('English excerpt cannot exceed 300 characters'),
  body('excerpt.vi').optional().isLength({ max: 300 }).withMessage('Vietnamese excerpt cannot exceed 300 characters'),
  body('categories').optional().isArray().withMessage('Categories must be an array'),
  body('categories.*').optional().isIn(['travel-tips', 'destinations', 'food-culture', 'news', 'guides']),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPublished').optional().isBoolean(),
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

    const blogData = req.body;

    // Generate slug from English title
    const slug = blogData.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({
        message: 'Blog with this title already exists',
        code: 'SLUG_EXISTS'
      });
    }

    const blog = new Blog({
      ...blogData,
      slug,
      author: req.user._id
    });

    await blog.save();
    await blog.populate('author', 'name email avatar');

    res.status(201).json({
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      message: 'Failed to create blog',
      error: error.message
    });
  }
});

// Update blog (admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('title.en').optional().trim().notEmpty().withMessage('English title cannot be empty'),
  body('title.vi').optional().trim().notEmpty().withMessage('Vietnamese title cannot be empty'),
  body('content.en').optional().notEmpty().withMessage('English content cannot be empty'),
  body('content.vi').optional().notEmpty().withMessage('Vietnamese content cannot be empty'),
  body('excerpt.en').optional().isLength({ max: 300 }).withMessage('English excerpt cannot exceed 300 characters'),
  body('excerpt.vi').optional().isLength({ max: 300 }).withMessage('Vietnamese excerpt cannot exceed 300 characters'),
  body('categories').optional().isArray().withMessage('Categories must be an array'),
  body('categories.*').optional().isIn(['travel-tips', 'destinations', 'food-culture', 'news', 'guides']),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isPublished').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
  body('relatedPosts').optional().isArray().withMessage('Related posts must be an array'),
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

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
        code: 'BLOG_NOT_FOUND'
      });
    }

    // Update slug if English title is changed
    if (updateData.title?.en && updateData.title.en !== blog.title.en) {
      const newSlug = updateData.title.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists
      const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingBlog) {
        return res.status(400).json({
          message: 'Blog with this title already exists',
          code: 'SLUG_EXISTS'
        });
      }

      updateData.slug = newSlug;
    }

    Object.assign(blog, updateData);
    await blog.save();
    await blog.populate('author', 'name email avatar');

    res.json({
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      message: 'Failed to update blog',
      error: error.message
    });
  }
});

// Delete blog (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
        code: 'BLOG_NOT_FOUND'
      });
    }

    await Blog.findByIdAndDelete(id);

    res.json({
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      message: 'Failed to delete blog',
      error: error.message
    });
  }
});

// Get featured blogs (public)
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const blogs = await Blog.find({ 
      isPublished: true, 
      isFeatured: true 
    })
      .populate('author', 'name email avatar')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      message: 'Featured blogs retrieved successfully',
      data: blogs
    });
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({
      message: 'Failed to get featured blogs',
      error: error.message
    });
  }
});

// Get blogs by category (public)
router.get('/category/:category', [
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('page').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10, page = 1 } = req.query;

    if (!['travel-tips', 'destinations', 'food-culture', 'news', 'guides'].includes(category)) {
      return res.status(400).json({
        message: 'Invalid category',
        code: 'INVALID_CATEGORY'
      });
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ 
      isPublished: true,
      categories: { $in: [category] }
    })
      .populate('author', 'name email avatar')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Blog.countDocuments({ 
      isPublished: true,
      categories: { $in: [category] }
    });

    res.json({
      message: 'Blogs by category retrieved successfully',
      data: blogs,
      category,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get blogs by category error:', error);
    res.status(500).json({
      message: 'Failed to get blogs by category',
      error: error.message
    });
  }
});

// Search blogs (public)
router.get('/search/text', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('category').optional().isIn(['travel-tips', 'destinations', 'food-culture', 'news', 'guides']),
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

    const query = {
      $text: { $search: q },
      isPublished: true
    };

    if (category) query.categories = { $in: [category] };

    const blogs = await Blog.find(query, { score: { $meta: 'textScore' } })
      .populate('author', 'name email avatar')
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json({
      message: 'Search results retrieved successfully',
      data: blogs,
      query: q
    });
  } catch (error) {
    console.error('Search blogs error:', error);
    res.status(500).json({
      message: 'Failed to search blogs',
      error: error.message
    });
  }
});

module.exports = router;
