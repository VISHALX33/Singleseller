import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Admin Order Detail Page - View and manage order status
 */
export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await adminService.getOrderById(id);
      setOrder(data);
      setNewStatus(data.status);
    } catch (error) {
      toast.error('Failed to load order');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order.status) {
      toast.error('Please select a different status');
      return;
    }

    try {
      setUpdating(true);
      await adminService.updateOrderStatus(id, newStatus, comment);
      toast.success('Order status updated successfully');
      fetchOrder();
      setComment('');
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
      processing: 'bg-purple-50 text-purple-700 border-purple-200',
      shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      delivered: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Order Details">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader className="mx-auto mb-4 animate-spin" size={40} />
            <p className="text-gray-600">Loading order...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout pageTitle="Order Not Found">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Order not found</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Orders
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Order Details" pageDescription={`Order #${order.orderNumber}`}>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.user?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.user?.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Product
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items?.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product?.thumbnail || 'https://via.placeholder.com/40'}
                              alt={item.product?.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <p>{item.product?.title}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">
                          ₹{item.product?.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                          ₹{(item.quantity * item.product?.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-700 mt-2">{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && (
                  <p className="text-gray-700">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-gray-700">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                  {order.shippingAddress?.postalCode}
                </p>
                <p className="text-gray-700 mt-3">
                  Phone: {order.shippingAddress?.phone}
                  <br />
                  Email: {order.shippingAddress?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
              <div
                className={`p-4 rounded-lg border-2 mb-4 ${getStatusColor(
                  order.status
                )}`}
              >
                <p className="text-2xl font-bold capitalize">{order.status}</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Update Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={updating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <textarea
                  placeholder="Add optional comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={updating}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />

                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-900">
                    ₹{order.pricing?.subtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax (5%)</p>
                  <p className="font-medium text-gray-900">₹{order.pricing?.tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium text-gray-900">
                    ₹{order.pricing?.shipping.toFixed(2)}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <p className="font-semibold text-gray-900">Total</p>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{order.pricing?.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
              <p className="text-gray-700 capitalize">{order.paymentMethod || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
