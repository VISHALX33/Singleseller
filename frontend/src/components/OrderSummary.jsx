import formatPrice from '../utils/formatPrice.js';
import { useCart } from '../context/CartContext.jsx';

export default function OrderSummary({ address, paymentMethod }) {
  const { subtotal, itemCount } = useCart();
  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-primary">Review</h3>
      <div className="text-sm"><span className="font-medium">Items:</span> {itemCount}</div>
      <div className="text-sm"><span className="font-medium">Subtotal:</span> {formatPrice(subtotal)}</div>
      <div className="text-sm"><span className="font-medium">Shipping:</span> {formatPrice(shipping)}</div>
      <div className="text-sm"><span className="font-medium">Tax:</span> {formatPrice(tax)}</div>
      <div className="font-semibold border-t pt-2 flex justify-between"><span>Total</span><span>{formatPrice(total)}</span></div>
      {address && (
        <div className="mt-4 text-xs text-slate-600">
          <p className="font-medium">Ship To:</p>
          <p>{address.name}, {address.street}, {address.city}, {address.state} {address.pincode}</p>
          <p>{address.phone}</p>
        </div>
      )}
      <p className="text-xs text-slate-500">Payment Method: {paymentMethod}</p>
    </div>
  );
}
