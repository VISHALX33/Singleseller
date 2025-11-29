import React from 'react';
import { AlertCircle } from 'lucide-react';

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📋' },
  { key: 'confirmed', label: 'Confirmed', icon: '✓' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'shipped', label: 'Shipped', icon: '📦' },
  { key: 'delivered', label: 'Delivered', icon: '✓' },
];

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const getStepStatus = (orderStatus, stepKey) => {
  if (orderStatus === 'cancelled') return 'cancelled';

  const currentIndex = STATUS_ORDER.indexOf(orderStatus);
  const stepIndex = STATUS_ORDER.indexOf(stepKey);

  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'pending';
};

export default function OrderStatusTimeline({ order }) {
  if (order.status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-red-900">Order Cancelled</h3>
            <p className="text-sm text-red-700 mt-1">
              {order.cancellationReason || 'This order has been cancelled.'}
            </p>
            {order.cancelledAt && (
              <p className="text-xs text-red-600 mt-2">
                Cancelled on {new Date(order.cancelledAt).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="font-semibold text-lg text-gray-900 mb-6">Delivery Status</h3>

      <div className="space-y-8">
        {TIMELINE_STEPS.map((step, index) => {
          const status = getStepStatus(order.status, step.key);
          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';
          const isPending = status === 'pending';

          let stepColor = 'bg-gray-200 text-gray-600';
          let labelColor = 'text-gray-600';
          let lineColor = 'bg-gray-200';

          if (isCompleted) {
            stepColor = 'bg-green-600 text-white';
            labelColor = 'text-gray-900';
            lineColor = 'bg-green-600';
          } else if (isCurrent) {
            stepColor = 'bg-blue-600 text-white';
            labelColor = 'text-gray-900';
            lineColor = 'bg-blue-200';
          }

          return (
            <div key={step.key}>
              {/* Step Container */}
              <div className="flex gap-4 items-start">
                {/* Timeline Dot */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 font-bold ${stepColor}`}>
                  {step.icon}
                </div>

                {/* Step Info */}
                <div className="flex-1 pt-1">
                  <h4 className={`font-semibold ${labelColor}`}>{step.label}</h4>

                  {/* Timestamp if Available */}
                  {isCompleted && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(
                        order[`${step.key}At`] || order.updatedAt
                      ).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}

                  {isCurrent && (
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      Expected by{' '}
                      {new Date(order.expectedDeliveryDate || new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)).toLocaleDateString(
                        'en-IN',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  )}

                  {isPending && (
                    <p className="text-xs text-gray-500 mt-1">Waiting...</p>
                  )}
                </div>
              </div>

              {/* Connecting Line to Next Step */}
              {index < TIMELINE_STEPS.length - 1 && (
                <div className="ml-5 mt-2 mb-2">
                  <div className={`w-0.5 h-8 ${lineColor}`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-semibold text-sm text-gray-900 mb-4">Status History</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {order.statusHistory.map((entry, index) => (
              <div key={index} className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{entry.status}</p>
                  {entry.comment && <p className="text-xs text-gray-600 mt-0.5">{entry.comment}</p>}
                </div>
                <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(entry.timestamp).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
