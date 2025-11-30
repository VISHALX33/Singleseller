import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import { adminListProducts, adminDeleteProduct } from '../../services/adminService.js';
import { Link } from 'react-router-dom';
import formatPrice from '../../utils/formatPrice.js';
import toast from 'react-hot-toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const list = await adminListProducts({ search }); setProducts(list); } catch {} finally { setLoading(false); }
  };
  useEffect(()=>{ load(); }, [search]);

  const remove = async (id) => {
    if (!confirm('Delete product?')) return;
    try { await adminDeleteProduct(id); toast.success('Deleted'); load(); } catch {}
  };

  const columns = [
    { key:'title', label:'Title' },
    { key:'price', label:'Price', render:r=> formatPrice(r.price) },
    { key:'stock', label:'Stock' },
    { key:'status', label:'Status', render:r=> <span className={`capitalize text-xs px-2 py-1 rounded ${r.status==='active'?'bg-green-100 text-green-700':'bg-slate-200 text-slate-600'}`}>{r.status}</span> },
    { key:'_id', label:'Actions', render:r=> <div className='flex gap-2'><Link to={`/admin/products/edit/${r._id}`} className='text-primary text-xs'>Edit</Link><button onClick={()=>remove(r._id)} className='text-red-600 text-xs'>Delete</button></div> }
  ];

  return (
    <AdminLayout>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-primary'>Products</h2>
        <Link to='/admin/products/add' className='btn-primary text-sm'>Add Product</Link>
      </div>
      <div className='mb-4 flex gap-2'>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search title...' className='border rounded px-3 py-2 text-sm w-64' />
        <button onClick={load} className='px-3 py-2 border rounded text-sm'>Refresh</button>
      </div>
      {loading && <p className='text-slate'>Loading...</p>}
      <DataTable columns={columns} data={products} pageSize={10} />
    </AdminLayout>
  );
}
