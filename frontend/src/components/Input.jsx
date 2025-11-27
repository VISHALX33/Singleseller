/**
 * Input Component - Reusable form input
 */

const Input = ({
  label,
  type = 'text',
  placeholder = '',
  error = '',
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 border-2 border-gray-200 rounded-lg
          focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
          disabled:bg-gray-100 disabled:text-gray-500
          transition-all duration-200
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
