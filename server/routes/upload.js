const express = require('express');
const router = express.Router();
const { cloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc    Test upload endpoint
// @route   GET /api/upload/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Upload endpoint is working',
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not configured',
      api_key: process.env.CLOUDINARY_API_KEY ? 'configured' : 'not configured',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'configured' : 'not configured'
    }
  });
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'zuna-travel'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'zuna-travel'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      urls: results.map(result => ({
        url: result.secure_url,
        public_id: result.public_id
      }))
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// @desc    Upload multiple images (alias for /multiple)
// @route   POST /api/upload/images
// @access  Private/Admin
router.post('/images', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const { folder = 'zuna-travel' } = req.body;
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: folder
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              publicId: result.public_id,
              originalName: file.originalname
            });
          }
        ).end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Images upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// @desc    Delete image
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
