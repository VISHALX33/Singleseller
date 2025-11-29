import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, X, AlertCircle, Loader, MapPin, Truck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import orderService from '../services/orderService';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch order details';
      setError(errorMsg);
      toast.error(errorMsg);
      setTimeout(() => navigate('/orders'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      setCancelling(true);
      await orderService.cancelOrder(id, cancelReason);
      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      fetchOrderDetails();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadInvoice = () => {
    // Placeholder for invoice download logic
    toast.success('Invoice download started');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-4 animate-spin" size={40} />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <div>
                <h2 className="font-semibold text-red-900">Error</h2>
                <p className="text-red-700 text-sm mt-1">{error || 'Order not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canCancelOrder = ['pending', 'confirmed'].includes(order.status);
  const createdDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-2"
          >
            ← Back to Orders
          </button>
          <div className="bg-white rounded-lg shadow-sm p-6 border-b-4 border-blue-600">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">{order.orderNumber}</h1>
                <p className="text-gray-600 text-sm mt-2">Placed on {createdDate}</p>
              </div>
              <div className="text-right">
                <button
                  onClick={handleDownloadInvoice}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <OrderStatusTimeline order={order} />

            {/* Order Items */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-6">Order Items</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-3 font-semibold text-gray-700">Product</th>
                      <th className="text-center py-3 px-3 font-semibold text-gray-700">Qty</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-700">Price</th>
                      <th className="text-right py-3 px-3 font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-3">
                          <div className="flex gap-3 items-center">
                            <img
                              src={item.product?.thumbnail || 'https://via.placeholder.com/60'}
                              alt={item.product?.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-2">
                                {item.product?.title}
                              </p>
                              <p className="text-xs text-gray-600">
                                {item.product?.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center">{item.quantity}</td>
                        <td className="py-4 px-3 text-right">₹{item.product?.price.toFixed(2)}</td>
                        <td className="py-4 px-3 text-right font-medium">
                          ₹{(item.quantity * item.product?.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                Delivery Address
              </h3>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                <p className="text-gray-700 mt-2">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-gray-700">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-gray-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-gray-700 mt-3">
                  📞 {order.shippingAddress.phone}
                  <br />
                  📧 {order.shippingAddress.email}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{order.pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (5%)</span>
                  <span>₹{order.pricing.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>₹{order.pricing.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{order.pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck size={18} className="text-purple-600" />
                Shipping Method
              </h3>
              <p className="text-gray-700 text-sm">Standard Delivery</p>
              <p className="text-gray-600 text-xs mt-1">3-5 Business Days</p>

              {order.trackingNumber && order.status === 'shipped' && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-600 mb-1">Tracking Number</p>
                  <p className="font-mono font-semibold text-blue-600 text-sm break-all">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-green-600" />
                Payment Method
              </h3>
              <p className="text-gray-700 capitalize text-sm">{order.paymentMethod}</p>
              {order.paymentMethod === 'cod' && (
                <p className="text-xs text-gray-600 mt-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                  💵 Pay ₹{order.pricing.total.toFixed(2)} at delivery
                </p>
              )}
            </div>

            {/* Cancel Order Action */}
            {canCancelOrder && (
              <div className="bg-white rounded-lg border p-6">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Cancel Order
                </button>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  You can cancel this order before it's processed
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 animate-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Cancel Order</h2>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                Are you sure you want to cancel this order? Please provide a reason.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Cancellation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g., Changed my mind, Found cheaper elsewhere..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows="4"
                  disabled={cancelling}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling || !cancelReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
