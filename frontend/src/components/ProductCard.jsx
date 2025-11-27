/**
 * ProductCard Component - Display single product in grid
 * Shows image, title, price, discount badge, add to cart button
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { ShoppingCart, Check } from 'lucide-react';

const ProductCard = ({ product, onClick = null }) => {
  const { addToCart, cartItems } = useCart();
  const [adding, setAdding] = useState(false);

  // Check if product is in cart
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.stock || product.stock <= 0) {
      return;
    }

    setAdding(true);
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      onClick={handleCardClick}
      className="group relative bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 ease-out hover:scale-105"
    >
      {/* Product Image Container */}
      <div className="relative w-full pt-full bg-gray-100 overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{product.discount}%
          </div>
        )}

        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
            ⭐ Featured
          </div>
        )}

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {product.category?.name || 'Category'}
        </p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        {product.ratings?.average > 0 && (
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(product.ratings.average) ? '★' : '☆'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.ratings.count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <p className="text-xs text-gray-600">
          {product.stock > 5 ? (
            <span className="text-green-600 font-semibold">In Stock</span>
          ) : product.stock > 0 ? (
            <span className="text-orange-600 font-semibold">Only {product.stock} left</span>
          ) : (
            <span className="text-red-600 font-semibold">Out of Stock</span>
          )}
        </p>

        {/* Add to Cart Button */}
        {quantityInCart > 0 ? (
          <div className="flex items-center justify-between bg-green-50 border-2 border-green-600 rounded-lg px-3 py-2">
            <span className="flex items-center gap-1 text-green-700 font-semibold text-sm">
              <Check size={16} />
              In Cart
            </span>
            <span className="bg-green-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {quantityInCart}
            </span>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.stock || product.stock <= 0 || adding}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed active:scale-95 duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
