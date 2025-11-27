/**
 * LoadingSkeletons Component - Animated product card skeletons
 * Used as placeholder while loading products
 */
import React from 'react';

const LoadingSkeletons = ({ count = 12 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="w-full h-48 bg-gray-200"></div>

          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Price Skeleton */}
            <div className="flex gap-2 items-center">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/4"></div>
            </div>

            {/* Rating Skeleton */}
            <div className="flex gap-1 items-center">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>

            {/* Stock Status Skeleton */}
            <div className="h-3 bg-gray-200 rounded w-24"></div>

            {/* Button Skeleton */}
            <div className="h-10 bg-gray-200 rounded mt-4"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LoadingSkeletons;
