/**
 * SearchBar Component - Product search with debouncing
 * Real-time search with suggestions
 */
import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../context/ProductContext.jsx';

const SearchBar = ({ placeholder = "Search products..." }) => {
  const { setSearchQuery, searchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  const handleSearch = (value) => {
    setSearchTerm(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce search API call
    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await searchProducts(value, 5);
        if (response.success && response.data) {
          setSuggestions(response.data.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.length >= 2) {
      setSearchQuery(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.title);
    setSearchQuery(product.title);
    setShowSuggestions(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        />
        <svg
          className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {loading && (
          <div className="absolute right-3 top-3.5">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {suggestions.map(product => (
            <button
              key={product._id}
              type="button"
              onClick={() => handleSuggestionClick(product)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center space-x-3 border-b last:border-b-0"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-8 h-8 object-cover rounded"
              />
              <span className="text-sm text-gray-800 flex-1 truncate">{product.title}</span>
              <span className="text-sm font-semibold text-gray-600">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
