const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { protect: authenticateToken, admin: requireAdmin } = require('../middleware/auth');
const { deleteImage } = require('../config/cloudinary');

const router = express.Router();

// Get all categories (public)
router.get('/', [
  query('type').optional().isIn(['vietnam-tours', 'transfer-services']),
  query('active').optional().isBoolean(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 }),
  query('includeSubcategories').optional().isBoolean(),
  query('level').optional().isInt({ min: 0, max: 2 }),
  query('parent').optional().isMongoId()
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
      type, 
      active, 
      limit = 20, 
      page = 1, 
      includeSubcategories = false,
      level,
      parent
    } = req.query;
    
    // Build query
    const query = {};
    if (type) query.type = type;
    if (active !== undefined) query.isActive = active === 'true';
    if (level !== undefined) query.level = parseInt(level);
    if (parent) query.parent = parent;

    const skip = (page - 1) * limit;

    let categoriesQuery = Category.find(query)
      .sort({ sortOrder: 1, createdAt: -1 });

    // Include subcategories if requested
    if (includeSubcategories === 'true') {
      categoriesQuery = categoriesQuery.populate({
        path: 'subcategories',
        match: { isActive: true },
        options: { sort: { sortOrder: 1 } }
      });
    }

    const categories = await categoriesQuery
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Category.countDocuments(query);

    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=900', // Cache for 15 minutes
      'ETag': `"categories-${total}-${Date.now()}"`,
      'Vary': 'Accept-Encoding'
    });

    res.json({
      message: 'Categories retrieved successfully',
      data: categories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: 'Failed to get categories',
      error: error.message
    });
  }
});

// Get category by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await Category.findOne({ slug, isActive: true })
      .populate({
        path: 'subcategories',
        match: { isActive: true },
        options: { sort: { sortOrder: 1 } }
      });
    
    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    res.json({
      message: 'Category retrieved successfully',
      data: category
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      message: 'Failed to get category',
      error: error.message
    });
  }
});

// Get categories hierarchy (public)
router.get('/hierarchy/:type', [
  query('active').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type } = req.params;
    const { active = true } = req.query;

    // Get main categories (level 0)
    const mainCategories = await Category.find({
      type,
      level: 0,
      isActive: active === 'true'
    })
    .populate({
      path: 'subcategories',
      match: { isActive: active === 'true' },
      options: { sort: { sortOrder: 1 } }
    })
    .sort({ sortOrder: 1, createdAt: -1 });

    res.json({
      message: 'Categories hierarchy retrieved successfully',
      data: mainCategories
    });
  } catch (error) {
    console.error('Get categories hierarchy error:', error);
    res.status(500).json({
      message: 'Failed to get categories hierarchy',
      error: error.message
    });
  }
});

// Get category by ID (admin)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    res.json({
      message: 'Category retrieved successfully',
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      message: 'Failed to get category',
      error: error.message
    });
  }
});

// Create category (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('name.en')
    .trim()
    .notEmpty()
    .withMessage('English name is required'),
  body('name.vi')
    .trim()
    .notEmpty()
    .withMessage('Vietnamese name is required'),
  body('type')
    .isIn(['vietnam-tours', 'transfer-services'])
    .withMessage('Type must be vietnam-tours or transfer-services'),
  body('description.en').optional().trim(),
  body('description.vi').optional().trim(),
  body('sortOrder').optional().isInt({ min: 0 }),
  body('images').optional().isArray(),
  body('parent').optional().isMongoId().withMessage('Parent must be a valid MongoDB ID'),
  body('level').optional().isInt({ min: 0, max: 2 }).withMessage('Level must be between 0 and 2'),
  body('location.en').optional().trim(),
  body('location.vi').optional().trim(),
  body('region').optional().isIn(['north', 'central', 'south', 'all']).withMessage('Region must be north, central, south, or all')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const categoryData = req.body;

    // Generate slug from English name
    const slug = categoryData.name.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        message: 'Category with this name already exists',
        code: 'SLUG_EXISTS'
      });
    }

    // Handle parent category and level
    if (categoryData.parent) {
      const parentCategory = await Category.findById(categoryData.parent);
      if (!parentCategory) {
        return res.status(400).json({
          message: 'Parent category not found',
          code: 'PARENT_NOT_FOUND'
        });
      }
      
      // Set level based on parent
      categoryData.level = parentCategory.level + 1;
      if (categoryData.level > 2) {
        return res.status(400).json({
          message: 'Cannot create category deeper than level 2',
          code: 'LEVEL_TOO_DEEP'
        });
      }
    } else {
      categoryData.level = 0;
    }

    const category = new Category({
      ...categoryData,
      slug
    });

    await category.save();

    // Update parent category's subcategories array
    if (categoryData.parent) {
      await Category.findByIdAndUpdate(
        categoryData.parent,
        { $push: { subcategories: category._id } }
      );
    }

    res.status(201).json({
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      message: 'Failed to create category',
      error: error.message
    });
  }
});

// Update category (admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('name.en')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('English name cannot be empty'),
  body('name.vi')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Vietnamese name cannot be empty'),
  body('type')
    .optional()
    .isIn(['vietnam-tours', 'transfer-services'])
    .withMessage('Type must be vietnam-tours or transfer-services'),
  body('description.en').optional().trim(),
  body('description.vi').optional().trim(),
  body('isActive').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0 }),
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

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    // Handle image deletion - delete old images that are no longer in the new images array
    if (updateData.images && category.images && category.images.length > 0) {
      const newImagePublicIds = updateData.images.map(img => img.publicId).filter(Boolean);
      const oldImagesToDelete = category.images.filter(img => 
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

    // Update slug if English name is changed
    if (updateData.name?.en && updateData.name.en !== category.name.en) {
      const newSlug = updateData.name.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if new slug already exists
      const existingCategory = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingCategory) {
        return res.status(400).json({
          message: 'Category with this name already exists',
          code: 'SLUG_EXISTS'
        });
      }

      updateData.slug = newSlug;
    }

    Object.assign(category, updateData);
    await category.save();

    res.json({
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      message: 'Failed to update category',
      error: error.message
    });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. It has ${productCount} product(s) associated with it.`,
        code: 'CATEGORY_HAS_PRODUCTS'
      });
    }

    // Delete images from Cloudinary if they exist
    if (category.images && category.images.length > 0) {
      for (const image of category.images) {
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

    await Category.findByIdAndDelete(id);

    res.json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      message: 'Failed to delete category',
      error: error.message
    });
  }
});

// Get category statistics (admin only)
router.get('/:id/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }

    const stats = await Product.aggregate([
      { $match: { category: category._id } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          featuredProducts: {
            $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
          },
          averageRating: { $avg: '$rating.average' }
        }
      }
    ]);

    const result = stats[0] || {
      totalProducts: 0,
      activeProducts: 0,
      featuredProducts: 0,
      averageRating: 0
    };

    res.json({
      message: 'Category statistics retrieved successfully',
      data: {
        category,
        stats: result
      }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      message: 'Failed to get category statistics',
      error: error.message
    });
  }
});

module.exports = router;
