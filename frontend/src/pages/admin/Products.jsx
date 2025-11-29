import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Admin Products Page - List and manage products
 */
export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProducts(page, 10, search);
      setProducts(data.products || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeleting(productId);
      await adminService.deleteProduct(productId);
      toast.success('Product deleted successfully');
      setProducts(products.filter((p) => p._id !== productId));
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const columns = [
    {
      key: 'thumbnail',
      label: 'Product',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img
            src={value || 'https://via.placeholder.com/40'}
            alt={row.title}
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{row.title}</p>
            <p className="text-xs text-gray-600">{row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => value?.name || 'N/A',
    },
    {
      key: 'price',
      label: 'Price',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">₹{value.toFixed(2)}</p>
          {row.mrp && row.mrp > value && (
            <p className="text-xs text-gray-600 line-through">₹{row.mrp.toFixed(2)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value > 0
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {value} units
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Edit',
      icon: Edit2,
      onClick: (row) => navigate(`/admin/products/edit/${row._id}`),
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: (row) => handleDelete(row._id),
      className: 'bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50',
    },
  ];

  return (
    <AdminLayout pageTitle="Products" pageDescription="Manage your product inventory">
      <div className="space-y-6">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/products/add')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Products Table */}
        <DataTable
          columns={columns}
          data={products}
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
