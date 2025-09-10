const cloudinary = require('cloudinary').v2;

const CLOUDINARY_CLOUD_NAME = 'devxmfk83'
const CLOUDINARY_API_KEY = '555955788839339'
const CLOUDINARY_API_SECRET = 'jBHZB3mCi16nB43sXIeYH06mpgA'

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Upload image to cloudinary
const uploadImage = async (imagePath, folder = 'zuna-travel') => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: folder,
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Upload multiple images
const uploadMultipleImages = async (imagePaths, folder = 'zuna-travel') => {
  try {
    const uploadPromises = imagePaths.map(imagePath => 
      uploadImage(imagePath, folder)
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

// Delete image from cloudinary
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Delete image error:', error);
    return false;
  }
};

// Delete multiple images
const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => 
      deleteImage(publicId)
    );
    
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Delete multiple images error:', error);
    return false;
  }
};

// Get optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    crop = 'fill',
    quality = 'auto:best',
    format = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop, quality, fetch_format: format }
    ]
  });
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getOptimizedImageUrl
};
