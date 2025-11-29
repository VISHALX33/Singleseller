import React from 'react';
import { MapPin, Truck, CreditCard, AlertCircle } from 'lucide-react';

export default function OrderSummary({ cartItems, address, paymentMethod, subtotal, onConfirm, isLoading = false }) {
  const TAX_RATE = 0.05;
  const SHIPPING_THRESHOLD = 500;
  const SHIPPING_COST = subtotal > SHIPPING_THRESHOLD ? 0 : 50;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  const getPaymentMethodLabel = (method) => {
    const methods = {
      card: 'Credit/Debit Card',
      upi: 'UPI',
      netbanking: 'Net Banking',
      wallet: 'Digital Wallet',
      cod: 'Cash on Delivery',
    };
    return methods[method] || method;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>

      {/* Delivery Address */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <MapPin size={20} className="text-blue-600 mt-1 shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
            <p className="font-medium text-gray-900">{address.fullName}</p>
            <p className="text-gray-600">{address.addressLine1}</p>
            {address.addressLine2 && (
              <p className="text-gray-600">{address.addressLine2}</p>
            )}
            <p className="text-gray-600">
              {address.city}, {address.state} - {address.postalCode}
            </p>
            <p className="text-gray-600">Phone: {address.phone}</p>
            <p className="text-gray-600">Email: {address.email}</p>
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Truck size={20} className="text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Shipping Method</h3>
            <p className="text-gray-600">Standard Delivery (3-5 business days)</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={20} className="text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Payment Method</h3>
            <p className="text-gray-600">{getPaymentMethodLabel(paymentMethod)}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Order Items ({cartItems.length})</h3>
        </div>
        <div className="divide-y">
          {cartItems.map((item) => (
            <div key={item._id} className="px-6 py-4 flex gap-4">
              <img
                src={item.thumbnail || 'https://via.placeholder.com/80'}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="font-semibold text-gray-900 mt-1">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (5%)</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {SHIPPING_COST === 0 ? 'Free' : `₹${SHIPPING_COST.toFixed(2)}`}
          </span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-semibold text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-blue-600">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Warning for COD */}
      {paymentMethod === 'cod' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Cash on Delivery Selected</p>
            <p className="text-sm text-yellow-700">
              You'll pay ₹{total.toFixed(2)} when your order is delivered.
            </p>
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {isLoading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}
