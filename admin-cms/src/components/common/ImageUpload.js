import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  folder = 'zuna-travel',
  label = 'Images',
  required = false 
}) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      fileArray.forEach(file => {
        formData.append('images', file);
      });
      formData.append('folder', folder);

      const response = await axios.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newImages = response.data.data.map(img => ({
        url: img.url,
        publicId: img.publicId,
        originalName: img.originalName
      }));

      onImagesChange([...images, ...newImages]);
      toast.success(`${fileArray.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (event) => {
    handleFileSelect(event.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = images[index];
    
    try {
      // Delete from Cloudinary
      await axios.delete(`/api/upload/image/${encodeURIComponent(imageToRemove.publicId)}`);
      
      // Remove from local state
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Remove image error:', error);
      toast.error('Failed to remove image');
    }
  };

  const reorderImages = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      
      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer flex flex-col items-center ${
            uploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
          <div className="text-sm text-gray-600">
            {uploading ? (
              <span>Uploading...</span>
            ) : images.length >= maxImages ? (
              <span>Maximum images reached</span>
            ) : (
              <span>
                Click to upload images or drag and drop
                <br />
                <span className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB (Max {maxImages} images)
                </span>
              </span>
            )}
          </div>
        </label>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={image.originalName}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          {/* Reorder Instructions */}
          {images.length > 1 && (
            <p className="text-xs text-gray-500">
              First image will be used as the main/featured image
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
