/**
 * ProductGrid Component - Responsive grid layout for products
 * Handles responsive columns and spacing
 */
import React from 'react';
import ProductCard from './ProductCard.jsx';
import LoadingSkeletons from './LoadingSkeletons.jsx';
import EmptyState from './EmptyState.jsx';

const ProductGrid = ({ products, loading = false, error = null, onProductClick = null }) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeletons count={12} />;
  }

  if (!products || products.length === 0) {
    return <EmptyState message="No products found. Try adjusting your filters." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
