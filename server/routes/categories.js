const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};
    if (type) {
      filter.type = type;
    }
    
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, type, image } = req.body;
    
    const category = new Category({
      name,
      description,
      type,
      image
    });
    
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = req.body.name || category.name;
      category.description = req.body.description || category.description;
      category.type = req.body.type || category.type;
      category.image = req.body.image || category.image;
      
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
