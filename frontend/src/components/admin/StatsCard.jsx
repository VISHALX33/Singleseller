import React from 'react';

/**
 * StatsCard Component - Reusable card for displaying statistics
 */
export default function StatsCard({ icon: Icon, label, value, change, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  const iconColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          {change && (
            <p className={`text-sm font-medium mt-2 ${change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${iconColor}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
