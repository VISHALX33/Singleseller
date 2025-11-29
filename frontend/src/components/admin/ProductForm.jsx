import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import ImageUploadPreview from './ImageUploadPreview';

/**
 * ProductForm Component - Reusable form for add/edit product
 * Props:
 *   initialData: Product object (for edit mode)
 *   categories: Array of category objects
 *   onSubmit: Function(formData)
 *   loading: Boolean
 *   submitLabel: String (default 'Save Product')
 */
export default function ProductForm({
  initialData = null,
  categories = [],
  onSubmit,
  loading = false,
  submitLabel = 'Save Product',
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    mrp: '',
    stock: '',
    sku: '',
    images: [],
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category?._id || initialData.category || '',
        price: initialData.price || '',
        mrp: initialData.mrp || '',
        stock: initialData.stock || '',
        sku: initialData.sku || '',
        images: initialData.images?.map((img) => ({ id: img, url: img })) || [],
        isFeatured: initialData.isFeatured || false,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImagesChange = (images) => {
    setFormData((prev) => ({
      ...prev,
      images: images,
    }));
    const files = images.filter((img) => img.file).map((img) => img.file);
    setImageFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare FormData for file upload
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('description', formData.description);
    fd.append('category', formData.category);
    fd.append('price', parseFloat(formData.price));
    fd.append('mrp', parseFloat(formData.mrp || formData.price));
    fd.append('stock', parseInt(formData.stock));
    fd.append('sku', formData.sku);
    fd.append('isFeatured', formData.isFeatured);

    // Add existing images (URLs)
    const existingImages = formData.images
      .filter((img) => !img.file)
      .map((img) => img.url);
    if (existingImages.length > 0) {
      fd.append('existingImages', JSON.stringify(existingImages));
    }

    // Add new images (files)
    imageFiles.forEach((file) => {
      fd.append('images', file);
    });

    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={16} /> {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows="4"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={16} /> {errors.description}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={16} /> {errors.category}
          </p>
        )}
      </div>

      {/* Price & MRP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Price (₹) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.price}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            MRP (₹)
          </label>
          <input
            type="number"
            name="mrp"
            value={formData.mrp}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-xs mt-1">
            Leave empty to match selling price
          </p>
        </div>
      </div>

      {/* Stock & SKU Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.stock && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.stock}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU *
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g., PROD-001"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.sku ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.sku && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.sku}
            </p>
          )}
        </div>
      </div>

      {/* Featured Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isFeatured"
          id="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          className="w-4 h-4 rounded border-gray-300 text-blue-600"
        />
        <label htmlFor="isFeatured" className="text-sm text-gray-700">
          Mark as Featured Product
        </label>
      </div>

      {/* Images */}
      <div>
        {errors.images && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {errors.images}
          </div>
        )}
        <ImageUploadPreview
          images={formData.images}
          onImagesChange={handleImagesChange}
          maxFiles={5}
          label="Product Images"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
