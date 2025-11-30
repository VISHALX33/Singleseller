import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';
import { adminUpdateProduct } from '../../services/adminService.js';
import { getProductById } from '../../services/productService.js';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try { const res = await getProductById(id); setProduct(res.product || res); } catch {} finally { setLoading(false); }
    })();
  },[id]);

  const submit = async (form) => {
    setSaving(true);
    try { const p = await adminUpdateProduct(id, form); setProduct(p); toast.success('Updated'); } catch {} finally { setSaving(false); }
  };

  return (
    <AdminLayout>
      <h2 className='text-xl font-semibold text-primary mb-4'>Edit Product</h2>
      {loading && <p className='text-slate'>Loading product...</p>}
      {product && <ProductForm initial={product} onSubmit={submit} submitting={saving} />}
    </AdminLayout>
  );
}
