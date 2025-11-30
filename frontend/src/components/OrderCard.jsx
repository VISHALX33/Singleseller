import formatPrice from '../utils/formatPrice.js';
import { Link } from 'react-router-dom';

export default function OrderCard({ order }) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{order.orderId}</span>
        <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary capitalize">{order.orderStatus}</span>
      </div>
      <p className="text-xs text-slate-600">Items: {order.items.length}</p>
      <p className="font-semibold text-primary">{formatPrice(order.total)}</p>
      <Link to={`/orders/${order._id}`} className="btn-primary text-center mt-2">Details</Link>
    </div>
  );
}
