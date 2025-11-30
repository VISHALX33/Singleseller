import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { adminGetOrder, adminUpdateOrderStatus } from '../../services/adminService.js';
import formatPrice from '../../utils/formatPrice.js';
import toast from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try { const o = await adminGetOrder(id); setOrder(o); } catch {} finally { setLoading(false); }
    })();
  },[id]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try { const o = await adminUpdateOrderStatus(id, status); setOrder(o); toast.success('Status updated'); } catch {} finally { setUpdating(false); }
  };

  if (loading) return <AdminLayout><p className='text-slate'>Loading order...</p></AdminLayout>;
  if (!order) return <AdminLayout><p className='text-slate'>Order not found.</p></AdminLayout>;

  return (
    <AdminLayout>
      <h2 className='text-xl font-semibold text-primary mb-4'>Order {order.orderId}</h2>
      <div className='space-y-6'>
        <div className='grid md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <p className='text-sm'>Status: <span className='capitalize font-medium'>{order.orderStatus}</span></p>
            <p className='text-sm'>Subtotal: {formatPrice(order.subtotal)}</p>
            <p className='text-sm'>Total: {formatPrice(order.total)}</p>
            <div className='flex flex-col gap-2'>
              <label className='text-xs font-medium'>Update Status</label>
              <select disabled={updating} value={order.orderStatus} onChange={e=>updateStatus(e.target.value)} className='border rounded px-3 py-2 text-sm'>
                {['placed','confirmed','packed','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {order.shippingAddress && (
              <div className='text-xs text-slate-600 mt-2'>
                <p className='font-medium'>Shipping Address</p>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            )}
          </div>
          <div className='md:col-span-2 space-y-3'>
            <h3 className='font-semibold'>Items</h3>
            <ul className='space-y-1 text-sm'>
              {order.items.map((it,i)=>(
                <li key={i} className='flex justify-between border-b py-1'>
                  <span>{it.product?.title || it.product?.name || it.product}</span>
                  <span>{it.quantity} x {formatPrice(it.price)} = {formatPrice(it.subtotal || it.quantity*it.price)}</span>
                </li>
              ))}
            </ul>
            <h3 className='font-semibold mt-4'>Status History</h3>
            <ul className='text-xs space-y-1'>
              {order.statusHistory.map((h,i)=>(
                <li key={i} className='flex justify-between'>
                  <span className='capitalize'>{h.status}</span>
                  <span>{new Date(h.timestamp || h.changedAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
