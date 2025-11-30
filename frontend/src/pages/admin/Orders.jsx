import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import { adminListOrders } from '../../services/adminService.js';
import { Link } from 'react-router-dom';
import formatPrice from '../../utils/formatPrice.js';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const list = await adminListOrders({ status }); setOrders(list); } catch {} finally { setLoading(false); }
  };
  useEffect(()=>{ load(); }, [status]);

  const filtered = orders.filter(o => !search || o.orderId.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key:'orderId', label:'Order ID' },
    { key:'orderStatus', label:'Status', render:r=> <span className='capitalize text-xs px-2 py-1 rounded bg-slate-100'>{r.orderStatus}</span> },
    { key:'total', label:'Total', render:r=> formatPrice(r.total) },
    { key:'user', label:'User', render:r=> (r.user ? (r.user.name || r.user.email || r.user._id) : '-') },
    { key:'_id', label:'Actions', render:r=> <Link to={`/admin/orders/${r._id}`} className='text-primary text-xs'>View</Link> }
  ];

  return (
    <AdminLayout>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-primary'>Orders</h2>
      </div>
      <div className='flex gap-2 mb-4'>
        <select value={status} onChange={e=>setStatus(e.target.value)} className='border rounded px-3 py-2 text-sm'>
          <option value=''>All Statuses</option>
          {['placed','confirmed','packed','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search order ID...' className='border rounded px-3 py-2 text-sm' />
        <button onClick={load} className='px-3 py-2 border rounded text-sm'>Refresh</button>
      </div>
      {loading && <p className='text-slate'>Loading...</p>}
      <DataTable columns={columns} data={filtered} pageSize={15} />
    </AdminLayout>
  );
}
