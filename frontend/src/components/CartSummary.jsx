import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function CartSummary({ subtotal, itemCount }) {
  const TAX_RATE = 0.05; // 5% tax
  const SHIPPING_THRESHOLD = 500; // Free shipping above 500
  const SHIPPING_COST = subtotal > SHIPPING_THRESHOLD ? 0 : 50;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 space-y-4">
      {/* Items Count */}
      <div className="flex items-center gap-2 pb-4 border-b">
        <ShoppingBag size={20} className="text-blue-600" />
        <div>
          <p className="text-sm text-gray-600">Items</p>
          <p className="text-lg font-semibold text-gray-900">{itemCount}</p>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 pb-4 border-b">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tax (5%)</span>
          <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">
            Shipping
            {SHIPPING_COST === 0 && <span className="text-green-600 ml-1">(Free)</span>}
          </span>
          <span className="font-medium text-gray-900">
            {SHIPPING_COST === 0 ? 'Free' : `₹${SHIPPING_COST.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Free Shipping Message */}
      {SHIPPING_COST > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          Add ₹{(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
        </div>
      )}

      {/* Total */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Amount</span>
          <span className="text-2xl font-bold">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
      >
        Proceed to Checkout
      </Link>

      {/* Continue Shopping */}
      <Link
        to="/products"
        className="block w-full border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold py-2 px-4 rounded-lg text-center transition-colors"
      >
        Continue Shopping
      </Link>

      {/* Info */}
      <div className="text-xs text-gray-600 text-center space-y-1">
        <p>✓ Secure checkout</p>
        <p>✓ Easy returns</p>
      </div>
    </div>
  );
}
