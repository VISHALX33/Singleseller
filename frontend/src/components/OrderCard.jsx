import React from 'react';
import { Package, ChevronRight } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { color: 'yellow', label: 'Pending', icon: '⏳' },
  confirmed: { color: 'blue', label: 'Confirmed', icon: '✓' },
  processing: { color: 'blue', label: 'Processing', icon: '⚙️' },
  shipped: { color: 'purple', label: 'Shipped', icon: '📦' },
  delivered: { color: 'green', label: 'Delivered', icon: '✓' },
  cancelled: { color: 'red', label: 'Cancelled', icon: '✕' },
};

const getStatusColor = (status) => {
  const config = STATUS_CONFIG[status];
  const colors = {
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };
  return colors[config.color];
};

export default function OrderCard({ order, onClick }) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const createdDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-gray-900">{order.orderNumber}</p>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 uppercase">Date</p>
                <p className="font-medium text-gray-900">{createdDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Items</p>
                <p className="font-medium text-gray-900">{order.items.length} item(s)</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Total</p>
                <p className="font-semibold text-gray-900">₹{order.pricing.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Payment</p>
                <p className="font-medium text-gray-900 capitalize">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Product Items Preview */}
            <div className="flex gap-2 items-center">
              {order.items.slice(0, 3).map((item) => (
                <div key={item._id} className="relative">
                  <img
                    src={item.product?.thumbnail || 'https://via.placeholder.com/40'}
                    alt={item.product?.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  {item.quantity > 1 && (
                    <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  )}
                </div>
              ))}
              {order.items.length > 3 && (
                <span className="text-sm text-gray-600 ml-2">+{order.items.length - 3} more</span>
              )}
            </div>
          </div>

          {/* Right Content - Status & Action */}
          <div className="flex flex-col items-end gap-4">
            {/* Status Badge */}
            <div className={`border px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {statusConfig.icon} {statusConfig.label}
            </div>

            {/* Chevron */}
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Delivery Info */}
        {order.status === 'shipped' && order.trackingNumber && (
          <div className="mt-4 pt-4 border-t bg-blue-50 rounded px-3 py-2">
            <p className="text-xs text-blue-700">
              📍 Tracking: <span className="font-mono font-semibold">{order.trackingNumber}</span>
            </p>
          </div>
        )}

        {order.status === 'delivered' && order.deliveredAt && (
          <div className="mt-4 pt-4 border-t bg-green-50 rounded px-3 py-2">
            <p className="text-xs text-green-700">
              ✓ Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
            </p>
          </div>
        )}

        {order.status === 'cancelled' && order.cancellationReason && (
          <div className="mt-4 pt-4 border-t bg-red-50 rounded px-3 py-2">
            <p className="text-xs text-red-700">
              Reason: {order.cancellationReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
