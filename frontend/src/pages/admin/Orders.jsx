import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Admin Orders Page - List and manage orders
 */
export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, status, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getOrders(page, 10, status, search);
      setOrders(data.orders || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-50 text-yellow-700',
      confirmed: 'bg-blue-50 text-blue-700',
      processing: 'bg-purple-50 text-purple-700',
      shipped: 'bg-indigo-50 text-indigo-700',
      delivered: 'bg-green-50 text-green-700',
      cancelled: 'bg-red-50 text-red-700',
    };
    return colors[status] || colors.pending;
  };

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order ID',
      sortable: true,
    },
    {
      key: 'user',
      label: 'Customer',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value?.name || 'N/A'}</p>
          <p className="text-xs text-gray-600">{value?.email || 'N/A'}</p>
        </div>
      ),
    },
    {
      key: 'pricing',
      label: 'Amount',
      render: (value) => <p className="font-medium">₹{value?.total.toLocaleString('en-IN')}</p>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString('en-IN'),
    },
  ];

  const actions = [
    {
      label: 'View',
      icon: Eye,
      onClick: (row) => navigate(`/admin/orders/${row._id}`),
    },
  ];

  return (
    <AdminLayout pageTitle="Orders" pageDescription="Manage and track customer orders">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          actions={actions}
          onPageChange={setPage}
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </AdminLayout>
  );
}
