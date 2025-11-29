import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import OrderCard from '../components/OrderCard';
import orderService from '../services/orderService';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders(page, 10, statusFilter);
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Package size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h1>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filter by Status
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setStatusFilter('');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onClick={() => navigate(`/orders/${order._id}`)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 rounded-lg font-medium ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
