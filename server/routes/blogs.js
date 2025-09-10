const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, featured, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = {};
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.vi': { $regex: search, $options: 'i' } },
        { 'content.en': { $regex: search, $options: 'i' } },
        { 'content.vi': { $regex: search, $options: 'i' } }
      ];
    }
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      success: true,
      data: blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get featured blogs
// @route   GET /api/blogs/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const blogs = await Blog.find({
      isFeatured: true,
      isPublished: true
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get blog by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (blog) {
      // Increment view count
      blog.views = (blog.views || 0) + 1;
      await blog.save();
      
      res.json({
        success: true,
        data: blog
      });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get blog by ID
// @route   GET /api/blogs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      featuredImage,
      featured,
      tags,
      author
    } = req.body;
    
    const blog = new Blog({
      title,
      content,
      excerpt,
      featuredImage,
      featured: featured || false,
      tags: tags || [],
      author: author || 'Admin'
    });
    
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      blog.title = req.body.title || blog.title;
      blog.content = req.body.content || blog.content;
      blog.excerpt = req.body.excerpt || blog.excerpt;
      blog.featuredImage = req.body.featuredImage || blog.featuredImage;
      blog.featured = req.body.featured !== undefined ? req.body.featured : blog.featured;
      blog.tags = req.body.tags || blog.tags;
      blog.author = req.body.author || blog.author;
      
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
