import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import orderService from '../services/orderService';
import AddressForm from '../components/AddressForm';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();

  const [step, setStep] = useState('address');
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h1>
          <p className="text-gray-600 mb-4">Add items to your cart before checkout.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = (formData) => {
    setAddress(formData);
    setStep('payment');
  };

  const handlePaymentSubmit = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!address || !paymentMethod) {
      toast.error('Please complete all steps');
      return;
    }

    setLoading(true);
    try {
      const order = await orderService.createOrder(address, paymentMethod);
      
      toast.success('Order placed successfully!');
      
      await clearCart();
      navigate(`/orders/${order._id}`, {
        state: { isNewOrder: true },
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mt-4 text-sm">
            <div className={`flex items-center gap-2 ${step === 'address' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step === 'address' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                1
              </span>
              Address
            </div>
            <ChevronRight size={16} className="text-gray-400" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                (step === 'payment' || step === 'review') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                2
              </span>
              Payment
            </div>
            <ChevronRight size={16} className="text-gray-400" />
            <div className={`flex items-center gap-2 ${step === 'review' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                3
              </span>
              Review
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {step === 'address' && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
                  <AddressForm
                    onSubmit={handleAddressSubmit}
                    isLoading={loading}
                  />
                </>
              )}

              {step === 'payment' && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                  <PaymentMethod
                    selectedMethod={paymentMethod}
                    onChange={setPaymentMethod}
                    isLoading={loading}
                  />
                  
                  {/* Navigation Buttons */}
                  <div className="flex gap-3 mt-8 pt-6 border-t">
                    <button
                      onClick={() => setStep('address')}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <ChevronLeft size={18} />
                      Back
                    </button>
                    <button
                      onClick={handlePaymentSubmit}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Continue
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </>
              )}

              {step === 'review' && (
                <div className="space-y-6">
                  {/* Back Button */}
                  <button
                    onClick={() => setStep('payment')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ChevronLeft size={18} />
                    Back to Payment
                  </button>
                  
                  <OrderSummary
                    cartItems={cartItems}
                    address={address}
                    paymentMethod={paymentMethod}
                    subtotal={subtotal}
                    onConfirm={handlePlaceOrder}
                    isLoading={loading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.title} x {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium">₹{(subtotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {subtotal > 500 ? 'Free' : `₹50.00`}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₹{(subtotal + (subtotal * 0.05) + (subtotal > 500 ? 0 : 50)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
