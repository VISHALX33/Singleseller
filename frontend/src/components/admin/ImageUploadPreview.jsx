import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

/**
 * ImageUploadPreview Component - Multiple image upload with preview and remove
 * Props:
 *   images: Array of { id?, url, file? }
 *   onImagesChange: Function(images)
 *   maxFiles: Number (default 5)
 *   label: String
 */
export default function ImageUploadPreview({
  images = [],
  onImagesChange,
  maxFiles = 5,
  label = 'Upload Images',
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max files limit
    if (images.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const newImages = await Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                resolve({
                  id: `new-${Date.now()}-${Math.random()}`,
                  url: e.target?.result,
                  file: file,
                });
              };
              reader.readAsDataURL(file);
            })
        )
      );

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (id) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer?.files || []);
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    Object.defineProperty(input, 'files', {
      value: new DataTransfer().items,
    });
    files.forEach((file) => {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      input.files = transfer.files;
    });
    handleFileSelect({ target: input });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxFiles}
          className="hidden"
        />

        {uploading ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto mb-4 text-gray-400" size={32} />
            <p className="text-gray-900 font-medium">Drag and drop images here</p>
            <p className="text-gray-600 text-sm">or click to select files</p>
            <p className="text-gray-500 text-xs mt-2">
              {maxFiles - images.length} image(s) remaining
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
            >
              <img
                src={image.url}
                alt="preview"
                className="w-full h-full object-cover"
              />

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(image.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>

              {/* Primary Badge */}
              {image.id === images[0]?.id && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg">
          <div className="text-center">
            <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-600">No images uploaded yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
