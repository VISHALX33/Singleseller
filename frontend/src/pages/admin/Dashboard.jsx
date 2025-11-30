import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import StatsCard from '../../components/admin/StatsCard.jsx';
import DataTable from '../../components/admin/DataTable.jsx';
import { getAdminStats } from '../../services/adminService.js';
import formatPrice from '../../utils/formatPrice.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try { const s = await getAdminStats(); setStats(s); } catch {} finally { setLoading(false); }
    })();
  }, []);

  return (
    <AdminLayout>
      <h2 className='text-2xl font-semibold text-primary mb-6'>Overview</h2>
      {loading && <p className='text-slate'>Loading stats...</p>}
      {stats && (
        <div className='space-y-8'>
          <div className='grid md:grid-cols-4 gap-4'>
            <StatsCard label='Products' value={stats.products} />
            <StatsCard label='Orders' value={stats.orders} />
            <StatsCard label='Customers' value={stats.customers} />
            <StatsCard label='Revenue' value={stats.revenue} money />
          </div>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='card'>
              <h3 className='font-semibold mb-2'>Status Breakdown</h3>
              <ul className='text-sm space-y-1'>
                {Object.entries(stats.statusBreakdown||{}).map(([k,v])=> <li key={k} className='flex justify-between'><span className='capitalize'>{k}</span><span>{v}</span></li>)}
                {Object.keys(stats.statusBreakdown||{}).length===0 && <li className='text-slate-500'>No orders yet.</li>}
              </ul>
            </div>
            <div className='card'>
              <h3 className='font-semibold mb-2'>Recent Orders</h3>
              <DataTable columns={[
                { key:'orderId', label:'Order ID' },
                { key:'orderStatus', label:'Status', render:r=> <span className='capitalize'>{r.orderStatus}</span> },
                { key:'total', label:'Total', render:r=> formatPrice(r.total) },
                { key:'createdAt', label:'Date', render:r=> new Date(r.createdAt).toLocaleDateString() }
              ]} data={stats.recentOrders || []} pageSize={5} />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
