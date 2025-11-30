import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { adminCreateProduct } from '../../services/adminService.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AddProduct() {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const submit = async (form) => {
    setSaving(true);
    try { const p = await adminCreateProduct(form); toast.success('Product created'); navigate(`/admin/products/edit/${p._id}`); } catch {} finally { setSaving(false); }
  };

  return (
    <AdminLayout>
      <h2 className='text-xl font-semibold text-primary mb-4'>Add Product</h2>
      <ProductForm onSubmit={submit} submitting={saving} />
    </AdminLayout>
  );
}
