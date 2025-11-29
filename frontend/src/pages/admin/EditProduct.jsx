import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductForm from '../../components/admin/ProductForm';
import * as adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Edit Product Page
 */
export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await adminService.getProductById(id);
      setProduct(data);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

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
      setSubmitting(true);
      await adminService.updateProduct(id, formData);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Edit Product" pageDescription="Update product details">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Edit Product" pageDescription="Update product details">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 max-w-4xl">
        {product && (
          <ProductForm
            initialData={product}
            categories={categories}
            onSubmit={handleSubmit}
            loading={submitting}
            submitLabel="Update Product"
          />
        )}
      </div>
    </AdminLayout>
  );
}
