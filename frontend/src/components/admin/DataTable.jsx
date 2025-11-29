import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Loader } from 'lucide-react';

/**
 * DataTable Component - Reusable table with sorting and pagination
 * Props:
 *   columns: Array of { key, label, sortable?, render? }
 *   data: Array of row objects
 *   loading: Boolean
 *   onSort: Function(key, direction)
 *   onPageChange: Function(page)
 *   totalPages: Number
 *   currentPage: Number
 *   actions: Array of { label, onClick, icon?, className? }
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  onSort = null,
  sortKey = null,
  sortDirection = 'asc',
  onPageChange = null,
  totalPages = 1,
  currentPage = 1,
  actions = [],
}) {
  const handleSort = (key) => {
    if (!onSort) return;
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="mx-auto mb-4 animate-spin" size={40} />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600 text-lg">No data found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  {col.sortable && onSort ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      {actions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => action.onClick(row)}
                            className={`p-2 rounded-lg transition-colors ${
                              action.className ||
                              'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                            title={action.label}
                          >
                            {Icon ? <Icon size={18} /> : action.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
