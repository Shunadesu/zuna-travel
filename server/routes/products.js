const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect: authenticateToken, admin: requireAdmin, optionalAuth } = require('../middleware/auth');
const { deleteImage } = require('../config/cloudinary');

const router = express.Router();

// Get all products (public with optional auth)
router.get('/', optionalAuth, [
  query('category').optional().isMongoId().withMessage('Invalid category ID'),
  query('featured').optional().isBoolean(),
  query('active').optional().isBoolean(),
  query('search').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sortBy').optional().isIn(['createdAt', 'title', 'price', 'rating']),
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

    // Build query
    const query = {};
    
    // For public access, only show active products unless user is admin
    if (!req.user || req.user.role !== 'admin') {
      query.isActive = true;
    } else if (active !== undefined) {
      query.isActive = active === 'true';
    }

    if (category) query.category = category;
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
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug type')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
      'ETag': `"products-${total}-${Date.now()}"`,
      'Vary': 'Accept-Encoding'
    });

    res.json({
      message: 'Products retrieved successfully',
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      message: 'Failed to get products',
      error: error.message
    });
  }
});

// Get product by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const product = await Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug type');
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({
      message: 'Failed to get product',
      error: error.message
    });
  }
});

// Get product by ID (admin)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id)
      .populate('category', 'name slug type');
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      message: 'Failed to get product',
      error: error.message
    });
  }
});

// Create product (admin only)
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

    const productData = req.body;

    // Verify category exists
    const category = await Category.findById(productData.category);
    if (!category) {
      return res.status(400).json({
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    // Generate slug from English title
    const slug = productData.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        message: 'Product with this title already exists',
        code: 'SLUG_EXISTS'
      });
    }

    const product = new Product({
      ...productData,
      slug
    });

    await product.save();
    await product.populate('category', 'name slug type');

    res.status(201).json({
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// Update product (admin only)
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

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
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
    }

    // Handle image deletion - delete old images that are no longer in the new images array
    if (updateData.images && product.images && product.images.length > 0) {
      const newImagePublicIds = updateData.images.map(img => img.publicId).filter(Boolean);
      const oldImagesToDelete = product.images.filter(img => 
        img.publicId && !newImagePublicIds.includes(img.publicId)
      );

      for (const image of oldImagesToDelete) {
        try {
          await deleteImage(image.publicId);
        } catch (deleteError) {
          console.error('Failed to delete old image from Cloudinary:', deleteError);
          // Continue with update even if image deletion fails
        }
      }
    }

    // Update slug if English title is changed
    if (updateData.title?.en && updateData.title.en !== product.title.en) {
      const newSlug = updateData.title.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists
      const existingProduct = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingProduct) {
        return res.status(400).json({
          message: 'Product with this title already exists',
          code: 'SLUG_EXISTS'
        });
      }

      updateData.slug = newSlug;
    }

    Object.assign(product, updateData);
    await product.save();
    await product.populate('category', 'name slug type');

    res.json({
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      });
    }

    // Delete images from Cloudinary if they exist
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.publicId) {
          try {
            await deleteImage(image.publicId);
          } catch (deleteError) {
            console.error('Failed to delete image from Cloudinary:', deleteError);
            // Continue with deletion even if image deletion fails
          }
        }
      }
    }

    await Product.findByIdAndDelete(id);

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

// Get featured products (public)
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .populate('category', 'name slug type')
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      message: 'Featured products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      message: 'Failed to get featured products',
      error: error.message
    });
  }
});

// Search products (public)
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

    const query = {
      $text: { $search: q },
      isActive: true
    };

    if (category) query.category = category;

    const products = await Product.find(query, { score: { $meta: 'textScore' } })
      .populate('category', 'name slug type')
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json({
      message: 'Search results retrieved successfully',
      data: products,
      query: q
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      message: 'Failed to search products',
      error: error.message
    });
  }
});

module.exports = router;
