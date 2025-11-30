import { useEffect, useState } from 'react';
import { getOrders } from '../services/orderService.js';
import OrderCard from '../components/OrderCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try { const list = await getOrders(); setOrders(list); } catch {} finally { setLoading(false); }
    })();
  },[]);

  if (loading) return <Loader />;

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-primary'>Your Orders</h2>
      {orders.length===0 && <p className='text-slate'>No orders yet.</p>}
      <div className='grid md:grid-cols-3 gap-4'>
        {orders.map(o => <OrderCard key={o._id} order={o} />)}
      </div>
    </div>
  );
}
