/**
 * ProductFilters Component - Sidebar with filters
 * Category, price range, stock status filters
 */
import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext.jsx';

const ProductFilters = () => {
  const {
    categories,
    filters,
    updateFilters,
    setPriceRange,
    setStockFilter,
    setSortBy,
    clearFilters,
  } = useProducts();

  const [localPriceRange, setLocalPriceRange] = useState([0, 100000]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    stock: true,
    sort: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (e, index) => {
    const newRange = [...localPriceRange];
    newRange[index] = parseInt(e.target.value);

    if (newRange[0] <= newRange[1]) {
      setLocalPriceRange(newRange);
    }
  };

  const applyPriceFilter = () => {
    setPriceRange(localPriceRange[0], localPriceRange[1]);
  };

  const hasActiveFilters =
    filters.category ||
    filters.search ||
    filters.stock ||
    filters.minPrice > 0 ||
    filters.maxPrice !== Infinity;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="border-b pb-6">
        <button
          onClick={() => toggleSection('sort')}
          className="w-full flex items-center justify-between py-2 font-semibold text-gray-800 hover:text-blue-600"
        >
          Sort By
          <span className={`transition-transform ${expandedSections.sort ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.sort && (
          <div className="mt-4 space-y-2">
            {[
              { value: '-createdAt', label: 'Newest First' },
              { value: 'price', label: 'Price: Low to High' },
              { value: '-price', label: 'Price: High to Low' },
              { value: '-ratings.average', label: 'Most Popular' },
            ].map(option => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={filters.sort === option.value}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="border-b pb-6">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between py-2 font-semibold text-gray-800 hover:text-blue-600"
        >
          Category
          <span className={`transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.category && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={!filters.category}
                onChange={() => updateFilters({ category: '' })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">All Categories</span>
            </label>

            {categories.map(category => (
              <label key={category._id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={category._id}
                  checked={filters.category === category._id}
                  onChange={() => updateFilters({ category: category._id })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-2 font-semibold text-gray-800 hover:text-blue-600"
        >
          Price Range
          <span className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.price && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-xs text-gray-600 block mb-1">Min Price</label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={localPriceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-800">
                  ₹{localPriceRange[0].toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-xs text-gray-600 block mb-1">Max Price</label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={localPriceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-800">
                  ₹{localPriceRange[1].toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={applyPriceFilter}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Apply Price Filter
            </button>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div>
        <button
          onClick={() => toggleSection('stock')}
          className="w-full flex items-center justify-between py-2 font-semibold text-gray-800 hover:text-blue-600"
        >
          Stock Status
          <span className={`transition-transform ${expandedSections.stock ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.stock && (
          <div className="mt-4 space-y-2">
            {[
              { value: '', label: 'All Items' },
              { value: 'in_stock', label: 'In Stock' },
              { value: 'out_of_stock', label: 'Out of Stock' },
            ].map(option => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="stock"
                  value={option.value}
                  checked={filters.stock === option.value}
                  onChange={() => setStockFilter(option.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
