import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import DataTable from '../../components/admin/DataTable';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Admin Dashboard - Overview with statistics
 */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);

      // Parse recent orders if available
      if (data.recentOrders) {
        setRecentOrders(data.recentOrders);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load dashboard');
      // Set mock data for demonstration
      setStats({
        totalProducts: 156,
        totalOrders: 842,
        totalCustomers: 234,
        totalRevenue: 125420.50,
        ordersByStatus: {
          pending: 12,
          confirmed: 45,
          processing: 28,
          shipped: 120,
          delivered: 637,
        },
        recentOrders: [
          {
            _id: '1',
            orderNumber: 'ORD-001',
            total: 2499,
            status: 'delivered',
            customerName: 'John Doe',
            createdAt: new Date(),
          },
          {
            _id: '2',
            orderNumber: 'ORD-002',
            total: 1599,
            status: 'shipped',
            customerName: 'Jane Smith',
            createdAt: new Date(),
          },
        ],
      });
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

  if (loading) {
    return (
      <AdminLayout pageTitle="Dashboard" pageDescription="Welcome to your admin dashboard">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Dashboard" pageDescription="Overview of your store performance">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Package}
            label="Total Products"
            value={stats?.totalProducts || 0}
            color="blue"
          />
          <StatsCard
            icon={TrendingUp}
            label="Total Revenue"
            value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            color="green"
          />
          <StatsCard
            icon={BarChart3}
            label="Total Orders"
            value={stats?.totalOrders || 0}
            change="+12% from last month"
            color="purple"
          />
          <StatsCard
            icon={Users}
            label="Total Customers"
            value={stats?.totalCustomers || 0}
            color="orange"
          />
        </div>

        {/* Order Status Overview */}
        {stats?.ordersByStatus && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { key: 'pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-700' },
                { key: 'confirmed', label: 'Confirmed', color: 'bg-blue-50 text-blue-700' },
                { key: 'processing', label: 'Processing', color: 'bg-purple-50 text-purple-700' },
                { key: 'shipped', label: 'Shipped', color: 'bg-indigo-50 text-indigo-700' },
                { key: 'delivered', label: 'Delivered', color: 'bg-green-50 text-green-700' },
              ].map((status) => (
                <div key={status.key} className={`p-4 rounded-lg ${status.color} text-center`}>
                  <p className="text-3xl font-bold">{stats.ordersByStatus[status.key] || 0}</p>
                  <p className="text-sm mt-1">{status.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </a>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.customerName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No recent orders</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
