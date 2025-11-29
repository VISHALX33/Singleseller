import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Add Product Page
 */
export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data.categories || data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await adminService.createProduct(formData);
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout pageTitle="Add Product" pageDescription="Create a new product">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 max-w-4xl">
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Create Product"
        />
      </div>
    </AdminLayout>
  );
}
