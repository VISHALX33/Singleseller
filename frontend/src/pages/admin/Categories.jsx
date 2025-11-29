import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Admin Categories Page - CRUD for categories
 */
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCategories(page, 10);
      setCategories(data.categories || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      if (editingId) {
        await adminService.updateCategory(editingId, formData.name, formData.description);
        toast.success('Category updated successfully');
      } else {
        await adminService.createCategory(formData.name, formData.description);
        toast.success('Category created successfully');
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({ name: category.name, description: category.description || '' });
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      setDeleting(categoryId);
      await adminService.deleteCategory(categoryId);
      toast.success('Category deleted successfully');
      setCategories(categories.filter((c) => c._id !== categoryId));
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeleting(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setErrors({});
  };

  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <p className="text-gray-700 line-clamp-2">{value || 'No description'}</p>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString('en-IN'),
    },
  ];

  const actions = [
    {
      label: 'Edit',
      icon: Edit2,
      onClick: handleEdit,
    },
    {
      label: 'Delete',
      icon: Trash2,
      onClick: (row) => handleDelete(row._id),
      className: 'bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50',
    },
  ];

  return (
    <AdminLayout pageTitle="Categories" pageDescription="Manage product categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Category
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingId ? 'Edit Category' : 'New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="Enter category name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={16} /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Table */}
        <DataTable
          columns={columns}
          data={categories}
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
