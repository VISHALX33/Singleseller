/**
 * EmptyState Component - Display when no products found
 * Shown when search/filter returns empty results
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({
  title = 'No Products Found',
  description = 'We couldn\'t find any products matching your search or filters.',
  icon = '📦',
  showCTA = true,
  ctaText = 'Browse All Products',
  ctaAction = null,
}) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (ctaAction) {
      ctaAction();
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="text-6xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-center mb-6 max-w-md">{description}</p>

      {/* CTA Button */}
      {showCTA && (
        <button
          onClick={handleCTA}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {ctaText}
        </button>
      )}

      {/* Helpful Suggestions */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg text-sm text-gray-700 max-w-md">
        <p className="font-semibold mb-2">💡 Helpful Tips:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Try adjusting your filters</li>
          <li>Check your search spelling</li>
          <li>Remove some filters to see more results</li>
          <li>Browse our categories for inspiration</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyState;
