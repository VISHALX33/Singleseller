/**
 * CategoryGrid Component - Display categories in grid layout
 * Shows all categories with image and name
 */
import React from 'react';
import { Link } from 'react-router-dom';
import LoadingSkeletons from './LoadingSkeletons.jsx';

const CategoryGrid = ({ categories = [], loading = false, error = null, onRetry = null }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <LoadingSkeletons count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-red-500 text-center mb-4">
          <p className="text-lg font-semibold">Failed to load categories</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No categories available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map(category => (
        <Link
          key={category._id}
          to={`/categories/${category.slug}/products`}
          className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-64 md:h-80"
        >
          {/* Category Image */}
          <img
            src={category.image || '/placeholder-category.png'}
            alt={category.name}
            onError={(e) => (e.target.src = '/placeholder-category.png')}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300"></div>

          {/* Category Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h3 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg mb-2">
              {category.name}
            </h3>

            {category.description && (
              <p className="text-gray-100 text-sm drop-shadow-md px-4 line-clamp-2">
                {category.description}
              </p>
            )}

            {/* Product Count */}
            {category.productCount !== undefined && (
              <p className="text-gray-200 text-xs mt-2">
                {category.productCount} products
              </p>
            )}

            {/* CTA */}
            <div className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-700">
              Shop Now →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
