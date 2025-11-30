import formatPrice from '../utils/formatPrice.js';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function CartSummary() {
  const { itemCount, subtotal } = useCart();
  const navigate = useNavigate();
  const estimatedTax = subtotal * 0.0; // placeholder
  const total = subtotal + estimatedTax;
  return (
    <div className="card space-y-2">
      <h3 className="text-lg font-semibold text-primary">Summary</h3>
      <div className="flex justify-between text-sm"><span>Items</span><span>{itemCount}</span></div>
      <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
      <div className="flex justify-between text-sm"><span>Estimated Tax</span><span>{formatPrice(estimatedTax)}</span></div>
      <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
      <button disabled={itemCount===0} onClick={()=>navigate('/checkout')} className="btn-primary w-full mt-2 disabled:opacity-50">Checkout</button>
    </div>
  );
}
