/**
 * ProductImageGallery Component - Main image + thumbnails
 * Zoom on hover, thumbnail carousel
 */
import React, { useState } from 'react';

const ProductImageGallery = ({ images = [], title = 'Product Image' }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const displayImages = images && images.length > 0 ? images : ['/placeholder-product.png'];
  const mainImage = displayImages[selectedImageIndex];

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleImageError = (e) => {
    e.target.src = '/placeholder-product.png';
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div
        className="relative w-full bg-gray-100 rounded-lg overflow-hidden group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Main Image */}
        <img
          src={mainImage}
          alt={title}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
        />

        {/* Zoom Indicator */}
        {displayImages.length > 1 && !isZoomed && (
          <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-semibold">
            Zoom
          </div>
        )}

        {/* Out of Stock Overlay */}
        {displayImages.length === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Product Image Not Available</span>
          </div>
        )}
      </div>

      {/* Main Image Info */}
      <div className="text-xs text-gray-500 text-center">
        Image {selectedImageIndex + 1} of {displayImages.length}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index
                  ? 'border-blue-600 shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={image}
                alt={`${title} - Image ${index + 1}`}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Navigation Arrows (if multiple images) */}
      {displayImages.length > 1 && (
        <div className="flex gap-2">
          <button
            onClick={() => {
              const newIndex = selectedImageIndex === 0 ? displayImages.length - 1 : selectedImageIndex - 1;
              handleThumbnailClick(newIndex);
            }}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition"
          >
            ← Previous
          </button>
          <button
            onClick={() => {
              const newIndex = selectedImageIndex === displayImages.length - 1 ? 0 : selectedImageIndex + 1;
              handleThumbnailClick(newIndex);
            }}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition"
          >
            Next →
          </button>
        </div>
      )}

      {/* Gallery Info */}
      <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
        <p>💡 Hover over the image to zoom in. Click thumbnails to view different angles.</p>
      </div>
    </div>
  );
};

export default ProductImageGallery;
