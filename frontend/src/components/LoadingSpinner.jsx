/**
 * Loading Spinner Component - Shows loading state
 */

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
