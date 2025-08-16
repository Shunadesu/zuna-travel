import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ImageGallery = ({ images = [], title = 'Images' }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const openLightbox = (index) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      
      {/* Main Image */}
      <div className="relative">
        <img
          src={images[0].url}
          alt={images[0].alt?.en || title}
          className="w-full h-64 md:h-80 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openLightbox(0)}
        />
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            +{images.length - 1} more
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.slice(1, 7).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url}
                alt={image.alt?.en || `${title} ${index + 2}`}
                className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(index + 1)}
              />
            </div>
          ))}
          {images.length > 7 && (
            <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
              +{images.length - 7}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronLeftIcon className="h-8 w-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                >
                  <ChevronRightIcon className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Main image */}
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt?.en || `${title} ${selectedImage + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
