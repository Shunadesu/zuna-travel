const express = require('express');
const multer = require('multer');
const { uploadImage, deleteImage, uploadMultipleImages } = require('../config/cloudinary');
const { protect: authenticateToken, admin: requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload single image
router.post('/image', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No image file provided',
        code: 'NO_FILE'
      });
    }

    const { folder = 'zuna-travel' } = req.body;

    // Convert buffer to base64 data URL for Cloudinary
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadImage(base64Image, folder);

    res.json({
      message: 'Image uploaded successfully',
      data: {
        url: result.url,
        publicId: result.publicId,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Upload multiple images
router.post('/images', authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No image files provided',
        code: 'NO_FILES'
      });
    }

    const { folder = 'zuna-travel' } = req.body;

    // Convert buffers to base64 data URLs
    const base64Images = req.files.map(file => 
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    );

    // Upload all images to Cloudinary
    const results = await uploadMultipleImages(base64Images, folder);

    // Combine results with file info
    const uploadResults = results.map((result, index) => ({
      url: result.url,
      publicId: result.publicId,
      originalName: req.files[index].originalname,
      size: req.files[index].size,
      mimetype: req.files[index].mimetype
    }));

    res.json({
      message: 'Images uploaded successfully',
      data: uploadResults,
      count: uploadResults.length
    });
  } catch (error) {
    console.error('Upload multiple images error:', error);
    res.status(500).json({
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// Delete image by public ID
router.delete('/image/:publicId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        message: 'Public ID is required',
        code: 'MISSING_PUBLIC_ID'
      });
    }

    // Decode the public ID (in case it's URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    const success = await deleteImage(decodedPublicId);

    if (!success) {
      return res.status(404).json({
        message: 'Image not found or already deleted',
        code: 'IMAGE_NOT_FOUND'
      });
    }

    res.json({
      message: 'Image deleted successfully',
      publicId: decodedPublicId
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// Upload image for rich text editor (e.g., blog content)
router.post('/editor', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No image file provided',
        code: 'NO_FILE'
      });
    }

    // Convert buffer to base64 data URL for Cloudinary
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary in editor folder
    const result = await uploadImage(base64Image, 'zuna-travel/editor');

    // Return format expected by most rich text editors
    res.json({
      success: 1,
      file: {
        url: result.url,
        publicId: result.publicId
      }
    });
  } catch (error) {
    console.error('Editor upload error:', error);
    res.status(500).json({
      success: 0,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Get upload statistics (admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // This would typically come from a database tracking uploads
    // For now, return basic info
    res.json({
      message: 'Upload statistics retrieved successfully',
      data: {
        totalUploads: 0,
        storageUsed: '0 MB',
        allowedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxFileSize: '10 MB',
        maxFilesPerUpload: 10
      }
    });
  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({
      message: 'Failed to get upload statistics',
      error: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File size too large. Maximum size is 10MB.',
        code: 'FILE_TOO_LARGE'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files. Maximum is 10 files per upload.',
        code: 'TOO_MANY_FILES'
      });
    }
  }

  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      message: 'Invalid file type. Only image files are allowed.',
      code: 'INVALID_FILE_TYPE'
    });
  }

  next(error);
});

module.exports = router;
