import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export default function EmptyCart() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <ShoppingCart size={32} className="text-blue-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any items to your cart yet. Start shopping to find products you love!
        </p>

        {/* CTA Button */}
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-3"
        >
          Continue Shopping
          <ArrowRight size={20} />
        </Link>

        {/* Secondary Link */}
        <Link
          to="/"
          className="block text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Back to Home
        </Link>

        {/* Features */}
        <div className="mt-8 space-y-2 text-xs text-gray-600">
          <p>✓ Fast & Free Shipping on Orders Over ₹500</p>
          <p>✓ Easy Returns & 100% Satisfaction Guarantee</p>
          <p>✓ Secure Payment Methods</p>
        </div>
      </div>
    </div>
  );
}
