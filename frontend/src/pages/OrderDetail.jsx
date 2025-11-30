import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../services/orderService.js';
import Loader from '../components/Loader.jsx';
import OrderStatusTimeline from '../components/OrderStatusTimeline.jsx';
import formatPrice from '../utils/formatPrice.js';
import toast from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try { const o = await getOrderById(id); setOrder(o); } catch {} finally { setLoading(false); }
    })();
  },[id]);

  const cancel = async () => {
    setCancelling(true);
    try { const o = await cancelOrder(id); setOrder(o); toast.success('Order cancelled'); } catch {} finally { setCancelling(false); }
  };

  if (loading) return <Loader />;
  if (!order) return <p className='text-slate'>Order not found.</p>;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-primary'>Order {order.orderId}</h2>
        {['placed','confirmed','packed'].includes(order.orderStatus) && (
          <button disabled={cancelling} onClick={cancel} className='px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white disabled:opacity-50'>Cancel</button>
        )}
      </div>
      <div className='grid md:grid-cols-3 gap-6'>
        <div className='space-y-2'>
          <h3 className='font-semibold'>Summary</h3>
          <p className='text-sm'>Status: <span className='capitalize font-medium'>{order.orderStatus}</span></p>
          <p className='text-sm'>Items: {order.items.length}</p>
          <p className='text-sm'>Subtotal: {formatPrice(order.subtotal)}</p>
          <p className='text-sm'>Total: {formatPrice(order.total)}</p>
          {order.shippingAddress && (
            <div className='text-xs text-slate-600 mt-2'>
              <p className='font-medium'>Shipping Address</p>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          )}
        </div>
        <div className='md:col-span-2 space-y-4'>
          <h3 className='font-semibold'>Items</h3>
          <ul className='space-y-2'>
            {order.items.map((it,i)=>(
              <li key={i} className='flex justify-between text-sm border-b py-1'>
                <span>{it.product?.title || it.product?.name || it.product}</span>
                <span>{it.quantity} x {formatPrice(it.price)} = {formatPrice(it.subtotal || it.quantity*it.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3 className='font-semibold mb-2'>Status Timeline</h3>
        <OrderStatusTimeline history={order.statusHistory} />
      </div>
    </div>
  );
}
